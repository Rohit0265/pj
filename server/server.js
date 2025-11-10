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

app.use(cors());
app.post('/clerk', express.raw({ type: 'application/json' }), clerkwebhooks);
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// ✅ JSON & Clerk middlewares
app.use(express.json());
app.use(clerkMiddleware());

// 🌐 Routes
app.get('/', (req, res) => res.send('Working hai bhai 😎'));
app.use('/api/educator', protextEducator, educator);
app.use('/api/course', courseRouter);
app.use('/api/user', userRouter);

// ❗ Catch unhandled routes
app.use((req, res) => {
    console.log("⚠️ Unhandled route:", req.path);
    res.status(404).send("Route not found: " + req.path);
});

app.listen(process.env.PORT, () => {
    console.log(`✅ Server is running on port ${process.env.PORT}`);
});

export default app;