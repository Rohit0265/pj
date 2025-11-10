// import { Webhook } from "svix";
// import User from "../model/user.js";

// const clerkwebhooks = async(req, res) => {
//     try {
//         const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

//         // 1. Get the raw body. 
//         // Thanks to express.raw(), req.body is now a Buffer/raw string.
//         const rawBody = req.body;

//         // 2. Verify the payload using the raw body (Buffer)
//         // This is where the original error occurred.
//         await whook.verify(rawBody, {
//             "svix-id": req.headers["svix-id"],
//             "svix-timestamp": req.headers["svix-timestamp"],
//             "svix-signature": req.headers["svix-signature"]
//         });

//         // 3. Manually parse the body *AFTER* verification is successful.
//         // Convert Buffer to string, then parse the JSON.
//         const body = JSON.parse(rawBody.toString('utf8'));

//         const { data, type } = body; // Use the newly parsed 'body' object

//         switch (type) {
//             case "user.created":
//                 await User.create({
//                     _id: data.id,
//                     email: data.email_addresses[0].email_address,
//                     name: `${data.first_name} ${data.last_name}`,
//                     imageUrl: data.image_url
//                 });
//                 return res.json({ success: true, message: "User created" });

//             case "user.updated":
//                 await User.findByIdAndUpdate(data.id, {
//                     email: data.email_addresses[0].email_address,
//                     name: `${data.first_name} ${data.last_name}`,
//                     imageUrl: data.image_url
//                 });
//                 return res.json({ success: true, message: "User updated" });

//             case "user.deleted":
//                 await User.findByIdAndDelete(data.id);
//                 return res.json({ success: true, message: "User deleted" });

//             default:
//                 return res.json({ success: true, message: `Unhandled event type: ${type}` });
//         }

//     } catch (error) {
//         console.error("Clerk Webhook Error:", error);
//         // Return a 400 Bad Request if verification or processing fails
//         return res.status(400).json({ success: false, message: error.message });
//     }
// };

// export { clerkwebhooks };import { Webhook } from "svix";
// routes/clerkWebhook.js
import { Webhook } from "svix";
import User from "../model/user.js";
import Stripe from "stripe";
import { request } from "express";
import { Endpoint } from "svix/dist/api/endpoint.js";
import { Purchase } from "../model/purchase.js";
import Course from "../model/modelSchema.js";


export const clerkwebhooks = async(req, res) => {
    try {
        let payload;

        // 🧠 Local development mode — skip signature verification
        if (process.env.NODE_ENV === "development") {
            try {
                // Express.raw() gives you Buffer data
                if (Buffer.isBuffer(req.body)) {
                    payload = JSON.parse(req.body.toString("utf8"));
                } else if (typeof req.body === "string") {
                    payload = JSON.parse(req.body);
                } else {
                    throw new Error("Invalid body format");
                }
                console.log("⚠️ Local mode: skipping Svix verification");
            } catch (err) {
                console.error("❌ Invalid JSON body:", err.message);
                return res
                    .status(400)
                    .json({ success: false, message: "Invalid JSON body" });
            }
        } else {
            // 🧩 Production mode — verify Svix signature
            try {
                const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
                payload = wh.verify(req.body, {
                    "svix-id": req.headers["svix-id"],
                    "svix-timestamp": req.headers["svix-timestamp"],
                    "svix-signature": req.headers["svix-signature"],
                });
            } catch (err) {
                console.error("❌ Webhook verification failed:", err.message);
                return res.status(400).json({
                    success: false,
                    message: "Webhook verification failed",
                });
            }
        }

        // 🧠 Extract event type & data
        const { type, data } = payload;
        console.log("📩 Clerk event received:", type);

        // Helper functions for safe extraction
        const getEmail = () => {
            if (data.email_addresses && data.email_addresses.length > 0) {
                return data.email_addresses[0].email_address;
            }
            return "";
        };

        const fullName = `${data.first_name || ""} ${data.last_name || ""}`.trim();

        // 🧱 Handle events
        switch (type) {
            case "user.created":
                await User.create({
                    clerkId: data.id,
                    email: getEmail(),
                    name: fullName,
                    imageUrl: data.image_url || "",
                });
                console.log("✅ User created:", getEmail());
                break;

            case "user.updated":
                await User.findOneAndUpdate({ clerkId: data.id }, {
                    email: getEmail(),
                    name: fullName,
                    imageUrl: data.image_url || "",
                }, { new: true });
                console.log("🔁 User updated:", getEmail());
                break;

            case "user.deleted":
                await User.findOneAndDelete({ clerkId: data.id });
                console.log("🗑️ User deleted:", data.id);
                break;

            default:
                console.log("⚠️ Unhandled Clerk event type:", type);
        }

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error("❌ Clerk webhook error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};




// const StripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

const StripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async(req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = StripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK
        );
    } catch (err) {
        console.error("⚠️ Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log("⚡ Stripe Event Type:", event.type);

    switch (event.type) {
        /* ✅ Payment succeeded */
        case "payment_intent.succeeded":
            {
                const paymentIntent = event.data.object;
                const { purchaseId } = paymentIntent.metadata || {};

                console.log("🟢 Payment successful for purchase:", purchaseId);

                if (!purchaseId) {
                    console.error("⚠️ No purchaseId in metadata");
                    break;
                }

                const purchaseData = await Purchase.findById(purchaseId);
                if (!purchaseData) {
                    console.error("❌ Purchase not found for:", purchaseId);
                    break;
                }

                purchaseData.status = "completed";
                purchaseData.events.push({
                    type: "payment.success",
                    timestamp: new Date(),
                });
                await purchaseData.save();

                console.log("✅ Purchase updated to completed:", purchaseId);
                break;
            }

            /* ❌ Payment failed */
        case "payment_intent.payment_failed":
            {
                const paymentIntent = event.data.object;
                const { purchaseId } = paymentIntent.metadata || {};

                console.log("🔴 Payment failed for purchase:", purchaseId);

                if (!purchaseId) {
                    console.error("⚠️ No purchaseId in metadata");
                    break;
                }

                const purchaseData = await Purchase.findById(purchaseId);
                if (purchaseData) {
                    purchaseData.status = "failed";
                    purchaseData.events.push({
                        type: "payment.failed",
                        reason: paymentIntent.last_payment_error.message || "Payment failed",
                        timestamp: new Date(),
                    });
                    await purchaseData.save();

                    console.log("❌ Purchase marked as failed:", purchaseId);
                }
                break;
            }

        default:
            console.log(`⚡ Unhandled event type: ${event.type}`);
    }

    return res.json({ received: true });
};