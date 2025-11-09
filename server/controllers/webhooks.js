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

        // 🧩 Local development — skip Svix signature verification
        if (process.env.NODE_ENV === "development") {
            try {
                // Clerk sends raw body (Buffer) because of express.raw()
                if (Buffer.isBuffer(req.body)) {
                    payload = JSON.parse(req.body.toString("utf8"));
                } else if (typeof req.body === "string") {
                    payload = JSON.parse(req.body);
                } else {
                    throw new Error("Expected raw Buffer or string body");
                }

                console.log("⚠️ Local mode: Skipping Svix verification");
            } catch (err) {
                console.error("❌ Invalid JSON body:", err);
                return res.status(400).json({ success: false, message: "Invalid JSON body" });
            }
        }

        // 🧩 Production — verify signature using Svix
        else {
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

        // ✅ Process the event
        const { type, data } = payload;
        console.log("📩 Clerk event received:", type);

        const getEmail = () => {
            if (data.email_addresses && data.email_addresses.length > 0) {
                return data.email_addresses[0].email_address;
            }
            return "";
        };

        const name = `${data.first_name || ""} ${data.last_name || ""}`.trim();

        switch (type) {
            case "user.created":
                await User.create({
                    clerkId: data.id,
                    email: getEmail(),
                    name: name,
                    imageUrl: data.image_url || "",
                });
                console.log("✅ User created:", getEmail());
                break;

            case "user.updated":
                await User.findOneAndUpdate({ clerkId: data.id }, { email: getEmail(), name: name, imageUrl: data.image_url || "" }, { new: true });
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







const StripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async(request, response) => {
    const sig = request.headers["stripe-signature"];
    let event;

    try {
        event = Stripe.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK
        );
    } catch (err) {
        console.error("⚠️ Webhook signature verification failed:", err.message);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log("⚡ Stripe Event Type:", event.type);

    switch (event.type) {
        case "payment_intent.succeeded":
            {
                const session = event.data.object;
                const { purchaseId } = session.metadata;

                console.log("purchaseId:", purchaseId);

                const purchaseData = await Purchase.findById(purchaseId);
                if (!purchaseData) {
                    console.error("❌ Purchase not found");
                    break;
                }

                purchaseData.status = "completed";
                await purchaseData.save();
                console.log("✅ Purchase status updated:", purchaseData.status);
                break;
            }

        case "payment_intent.payment_failed":
            {
                const paymentIntent = event.data.object;
                const sessions = await StripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                });
                const { purchaseId } = sessions.data[0].metadata;
                const purchaseData = await Purchase.findById(purchaseId);
                if (purchaseData) {
                    purchaseData.status = "failed";
                    await purchaseData.save();
                    console.log("❌ Payment failed for purchase:", purchaseId);
                }
                break;
            }

        default:
            console.log(`⚡ Unhandled event type: ${event.type}`);
    }

    return response.json({ received: true });
};