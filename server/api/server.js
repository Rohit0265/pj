// import express from 'express';
// import cors from 'cors';
// import 'dotenv/config';
// import mongoosedb from '../config/mongo.js';
// import { Webhook } from '../controllers/webhooks.js';
// import serverless from 'serverless-http';

// // Initialize express
// const app = express();
// app.use(cors());
// app.use(express.json());

// // Mongo connection
// await mongoosedb();

// // Routes
// app.get('/', (req, res) => {
//     res.send('Working hai bhai 😎');
// });

// app.post('/clerk', Webhook);

// // Export serverless handler
// export const handler = serverless(app);


import express from 'express';
import serverless from 'serverless-http';

const app = express();

app.get('/', (req, res) => {
    res.send('✅ Working perfectly on Vercel!');
});

export const handler = serverless(app);