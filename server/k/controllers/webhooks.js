import { Webhook } from "svix";
import User from "../model/user.js";
import Stripe from "stripe";
import { Purchase } from "../model/purchase.js";
import Course from "../model/modelSchema.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* ==========================================================
   📦 CLERK WEBHOOK HANDLER (No Optional Chaining)
   ========================================================== */
export const clerkwebhooks = async(req, res) => {
    let payload;

    try {
        // 🧠 Development Mode — Skip Svix Verification
        if (process.env.NODE_ENV === "development") {
            try {
                if (Buffer.isBuffer(req.body)) {
                    payload = JSON.parse(req.body.toString("utf8"));
                } else if (typeof req.body === "string") {
                    payload = JSON.parse(req.body);
                } else if (typeof req.body === "object") {
                    payload = req.body;
                } else {
                    throw new Error("Invalid body format for Clerk webhook");
                }
                console.log("⚠️ DEV mode: Skipping Svix verification");
            } catch (err) {
                console.error("❌ Invalid JSON body (dev):", err.message);
                return res.status(400).json({ success: false, message: "Invalid Clerk JSON body" });
            }
        } else {
            // ✅ Production Mode — Verify Svix Signature
            const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
            payload = webhook.verify(req.body, {
                "svix-id": req.headers["svix-id"],
                "svix-timestamp": req.headers["svix-timestamp"],
                "svix-signature": req.headers["svix-signature"],
            });
        }

        // Safe destructuring
        const type = payload && payload.type ? payload.type : null;
        const data = payload && payload.data ? payload.data : {};

        console.log("📩 Clerk event:", type);

        // Safe property extraction (no ?.)
        let email = "";
        if (data && data.email_addresses && data.email_addresses.length > 0) {
            email = data.email_addresses[0].email_address;
        }

        const firstName = data && data.first_name ? data.first_name : "";
        const lastName = data && data.last_name ? data.last_name : "";
        const fullName = (firstName + " " + lastName).trim();

        switch (type) {
            case "user.created":
                await User.findOneAndUpdate({ clerkId: data.id }, {
                    clerkId: data.id,
                    email: email,
                    name: fullName,
                    imageUrl: data.image_url || "",
                }, { upsert: true, new: true });
                console.log("✅ User created/upserted:", email);
                break;

            case "user.updated":
                await User.findOneAndUpdate({ clerkId: data.id }, {
                    email: email,
                    name: fullName,
                    imageUrl: data.image_url || "",
                }, { new: true });
                console.log("🔁 User updated:", email);
                break;

            case "user.deleted":
                await User.findOneAndDelete({ clerkId: data.id });
                console.log("🗑️ User deleted:", data.id);
                break;

            default:
                console.log("⚠️ Unhandled Clerk event:", type);
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("❌ Clerk webhook error:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

/* ==========================================================
   💳 STRIPE WEBHOOK HANDLER (No Optional Chaining)
   ========================================================== */
export const stripeWebhooks = async(req, res) => {
    const sig = req.headers["stripe-signature"];

    try {
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK
        );

        console.log("⚡ Stripe Event:", event.type);

        switch (event.type) {
            // ✅ Successful Payment
            case "checkout.session.completed":
            case "payment_intent.succeeded":
                {
                    const session = event.data.object;
                    const metadata = session && session.metadata ? session.metadata : {};
                    const purchaseId = metadata.purchaseId || null;

                    if (!purchaseId) {
                        console.warn("⚠️ No purchaseId in metadata");
                        break;
                    }

                    const purchase = await Purchase.findById(purchaseId);
                    if (!purchase) {
                        console.warn("⚠️ Purchase not found:", purchaseId);
                        break;
                    }

                    purchase.status = "completed";
                    await purchase.save();
                    console.log("✅ Purchase completed:", purchaseId);
                    break;
                }

                // ❌ Payment Failed
            case "payment_intent.payment_failed":
                {
                    const paymentIntent = event.data.object;
                    try {
                        const sessions = await stripe.checkout.sessions.list({
                            payment_intent: paymentIntent.id,
                            limit: 1,
                        });

                        let purchaseId = null;
                        if (
                            sessions &&
                            sessions.data &&
                            sessions.data.length > 0 &&
                            sessions.data[0].metadata &&
                            sessions.data[0].metadata.purchaseId
                        ) {
                            purchaseId = sessions.data[0].metadata.purchaseId;
                        }

                        if (purchaseId) {
                            const purchase = await Purchase.findById(purchaseId);
                            if (purchase) {
                                purchase.status = "failed";
                                await purchase.save();
                                console.log("❌ Payment failed for:", purchaseId);
                            }
                        }
                    } catch (err) {
                        console.error("❌ Error handling payment_failed:", err.message);
                    }
                    break;
                }

                // ⚠️ Other Event
            default:
                console.log("⚠️ Unhandled Stripe event:", event.type);
        }

        return res.status(200).json({ received: true });
    } catch (err) {
        console.error("⚠️ Stripe webhook verification failed:", err.message);
        return res.status(400).send("Webhook Error: " + err.message);
    }
};