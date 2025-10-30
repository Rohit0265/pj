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

        // 🧩 Local testing — skip Svix signature verification
        if (process.env.NODE_ENV === "development") {
            try {
                payload = JSON.parse(req.body.toString());
            } catch (err) {
                console.error("❌ Invalid JSON body in local mode:", err);
                return res.status(400).json({ success: false, message: "Invalid JSON body" });
            }
            console.log("⚠️ Skipping Svix signature verification (local mode)");
        }
        // 🧩 Production — verify signature with Svix
        else {
            const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
            payload = wh.verify(req.body, {
                "svix-id": req.headers["svix-id"],
                "svix-timestamp": req.headers["svix-timestamp"],
                "svix-signature": req.headers["svix-signature"]
            });
        }

        const { type, data } = payload;

        console.log("📩 Clerk event:", type);

        // 🧠 Handle Clerk events
        switch (type) {
            case "user.created":
                await User.create({
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    imageUrl: data.image_url
                });
                break;

            case "user.updated":
                await User.findByIdAndUpdate(data.id, {
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    imageUrl: data.image_url
                });
                break;

            case "user.deleted":
                await User.findByIdAndDelete(data.id);
                break;

            default:
                console.log("⚠️ Unhandled event type:", type);
        }

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error("❌ Clerk webhook error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};


// export const stripeWebhooks = async(request, response) => {
//     const sig = request.headers["stripe-signature"];
//     let event;

//     // --- 1. WEBHOOK VERIFICATION (Requires raw body from server.js) ---
//     try {
//         // This line MUST receive the raw body (Buffer) to succeed and avoid the 400 error.
//         event = StripeInstance.webhooks.constructEvent(
//             request.body, // Must be the raw request body Buffer/string
//             sig,
//             process.env.STRIPE_WEBHOOK
//         );
//     } catch (error) {
//         console.error("❌ Webhook verification failed (400 Bad Request):", error.message);
//         return response.writeHead(400, { 'Content-Type': 'text/plain' }).end(`Webhook Error: ${error.message}`);
//     }

//     // --- 2. FULFILLMENT LOGIC (Simplified to match your structure) ---
//     try {
//         switch (event.type) {

//             case "payment_intent.succeeded":
//                 {
//                     const paymentIntent = event.data.object;
//                     const paymentIntentId = paymentIntent.id;

//                     // ✅ Get related checkout session (like your original code)
//                     const sessions = await StripeInstance.checkout.sessions.list({
//                         payment_intent: paymentIntentId,
//                     });

//                     if (!sessions.data.length) {
//                         console.warn("⚠️ No session found for payment intent:", paymentIntentId);
//                         break;
//                     }

//                     const { purchaseId } = sessions.data[0].metadata;

//                     const purchaseData = await Purchase.findById(purchaseId);

//                     // 🔑 IDEMPOTENCY CHECK: If already completed, stop here.
//                     // This fixes the race condition where the status is accidentally reset.
//                     if (!purchaseData || purchaseData.status === 'completed') {
//                         console.log(`ℹ️ Purchase ${purchaseId} already completed or invalid. Skipping fulfillment.`);
//                         break;
//                     }

//                     const userData = await User.findById(purchaseData.userId);
//                     const courseData = await Course.findById(purchaseData.courseId.toString());

//                     if (!userData || !courseData) break;

//                     // ✅ Enrollments (Prevent duplicates)
//                     if (!courseData.enrolledStudents.includes(userData._id)) {
//                         courseData.enrolledStudents.push(userData._id);
//                         await courseData.save();
//                     }

//                     if (!userData.enrolledCourses.includes(courseData._id)) {
//                         userData.enrolledCourses.push(courseData._id);
//                         await userData.save();
//                     }

//                     // 🎯 Final status update
//                     purchaseData.status = "completed";
//                     await purchaseData.save();

//                     console.log("✅ Payment succeeded and data saved.");
//                     break;
//                 }

//             case "payment_intent.payment_failed":
//                 {
//                     const paymentIntent = event.data.object;
//                     const paymentIntentId = paymentIntent.id;

//                     const sessions = await StripeInstance.checkout.sessions.list({
//                         payment_intent: paymentIntentId,
//                     });

//                     if (!sessions.data.length) break;

//                     const { purchaseId } = sessions.data[0].metadata;
//                     const purchaseData = await Purchase.findById(purchaseId);
//                     if (purchaseData) {
//                         purchaseData.status = "failed";
//                         await purchaseData.save();
//                     }

//                     console.log("⚠️ Payment failed. Purchase marked as failed.");
//                     break;
//                 }

//             default:
//                 console.log(`⚡ Unhandled event type: ${event.type}`);
//         }

//         // ✅ Return 200 OK (received: true) to acknowledge the event
//         response.writeHead(200, { 'Content-Type': 'application/json' });
//         response.end(JSON.stringify({ received: true }));

//     } catch (err) {
//         // 💥 Internal server logic error catch
//         console.error("💥 Error handling webhook fulfillment:", err);
//         response.writeHead(500, { 'Content-Type': 'text/plain' });
//         response.end("Internal Server Error");
//     }
// };

const StripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

export const stripeWebhooks = async(requestt, response) => {
    const sig = request.headers['stripe-signature'];
    let event;
    try {
        event = Stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK)
    } catch (error) {
        response.status(400).send(`Webhook Error: ${err.message}`);
    }
    switch (event.type) {
        case "payment_intent.succeeded":
            {
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;
                const sessions = await StripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId,
                });
                const { purchaseId } = sessions.data[0].metadata;
                const purchaseData = await Purchase.findById(purchaseId);
                const userData = await User.findById(purchaseData.userId);
                const courseData = await Course.findById(purchaseData.courseId.toString());
                courseData.enrolledStudents.push(userData);
                await courseData.save();
                userData.enrolledCourses.push(courseData._id)
                await userData.save()
                // 🎯 Final status update
                purchaseData.status = 'completed';
                await purchaseData.save();
                break;
            }

        case "payment_intent.payment_failed":
            {
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;

                const sessions = await StripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId,
                });
                const { purchaseId } = sessions.data[0].metadata;
                const purchaseData = await Purchase.findById(purchaseId);
                if (purchaseData) {
                    purchaseData.status = "failed";
                    await purchaseData.save();
                }
            }

        default:
            console.log(`⚡ Unhandled event type: ${event.type}`);
    }
    response.json({ recieved: true })

}