import express from "express";
import { Webhook } from "svix";
import bodyParser from "body-parser";
import User from "../model/user.js";

const app = express();

// For all other routes, you can use normal JSON parser
app.use(express.json());

// Webhook route
app.post("/api/webhooks/clerk", bodyParser.raw({ type: "application/json" }), async(req, res) => {
    try {
        let payload;

        if (process.env.NODE_ENV === "development") {
            // Local testing: parse raw buffer safely
            try {
                payload = JSON.parse(req.body.toString());
            } catch (parseErr) {
                console.error("Invalid JSON:", parseErr);
                return res.status(400).json({ success: false, message: "Invalid JSON" });
            }
            console.log("Skipping Svix verification in development");
            console.log("Webhook payload:", payload);
        } else {
            // Production: verify signature
            const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
            payload = wh.verify(req.body, {
                "svix-id": req.headers["svix-id"],
                "svix-timestamp": req.headers["svix-timestamp"],
                "svix-signature": req.headers["svix-signature"]
            });
        }

        const { data, type } = payload;

        switch (type) {
            case "user.created":
                await User.create({
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    imageUrl: data.image_url
                });
                return res.json({ success: true });

            case "user.updated":
                await User.findByIdAndUpdate(data.id, {
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    imageUrl: data.image_url
                });
                return res.json({ success: true });

            case "user.deleted":
                await User.findByIdAndDelete(data.id);
                return res.json({ success: true });

            default:
                return res.json({ success: true, message: "Unhandled event" });
        }

    } catch (error) {
        console.error("Webhook handler error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
});

export { app };