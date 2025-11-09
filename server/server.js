// import express from 'express';
// import cors from 'cors';
// import 'dotenv/config';
// import mongoosedb from './config/mongo.js';
// import { clerkMiddleware } from '@clerk/express'
// import { clerkwebhooks } from './controllers/webhooks.js';
// import educator from './routes/educatorRout.js';
// import connectClodinary from './config/Cloudnary.js';
// import { protextEducator } from './middlewares/authMiddleware.js';

// const app = express();

// // Connect to MongoDB
// await mongoosedb();
// await connectClodinary();

// // Middleware
// app.use(cors());
// app.use(clerkMiddleware())
//     // Routes
// app.get('/', (req, res) => res.send('Working hai bhai 😎'));
// app.post('/clerk', express.raw({ type: "application/json" }), clerkwebhooks);
// app.use('/api/educator', express.json(), protextEducator, educator);


// // ✅ Use JSON parser for normal routes (optional)
// app.use(express.json());

// app.listen(process.env.PORT, () => {
//     console.log(`Server is running on port ${process.env.PORT}`);
// });

// export default app;
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoosedb from './config/mongo.js';
import { clerkMiddleware } from '@clerk/express';
import { clerkwebhooks, stripeWebhooks } from './controllers/webhooks.js';
import educator from './routes/educatorRout.js';
import connectClodinary from './config/Cloudnary.js';
import { protextEducator } from './middlewares/authMiddleware.js';
import courseRouter from './routes/coursseRoute.js';
import userRouter from './routes/userRoutes.js';

const app = express();

// 🧠 Connect to MongoDB and Cloudinary
await mongoosedb().catch(console.error);
await connectClodinary().catch(console.error);


// ✅ Always start with CORS
// app.use(cors());
// import cors from "cors";

app.use(cors());

// ⚠️ Do NOT use express.json() before raw webhook routes!
// Stripe & Clerk webhooks require raw body for signature verification

// 🔔 Webhook routes (must come before any JSON middleware)
app.post('/clerk', express.raw({ type: 'application/json' }), clerkwebhooks);
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// ✅ Now apply global middleware for normal routes
app.use(express.json());
app.use(clerkMiddleware());

// 🌐 API routes
app.get('/', (req, res) => res.send('Working hai bhai 😎'));
app.use('/api/educator', protextEducator, educator);
app.use('/api/course', courseRouter);
app.use('/api/user', userRouter);
app.use((req, res) => {
    console.log("⚠️ Unhandled route:", req.path);
    res.status(404).send("Route not found: " + req.path);
});
// 🚀 Start server
app.listen(process.env.PORT, () => {
    console.log(`✅ Server is running on port ${process.env.PORT}`);
});

export default app;