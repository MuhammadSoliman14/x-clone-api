import express from 'express';
import type { NextFunction, Request , Response } from 'express';
import mongoose from'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import tweetRoutes from './routes/tweetRoutes.js';
import followRoutes from './routes/followRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config()
if (!process.env.MONGO_URI) { console.error('MONGO_URI not set'); process.exit(1) }
if (!process.env.JWT_SECRET) { console.error('JWT_SECRET not set'); process.exit(1) }


const app = express();
const PORT = process.env.PORT || 8080;

const MONGO_URI = process.env.MONGO_URI || ''

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {message: 'Too many requests, please try again in a while'}
})

app.use(helmet())
app.use(cors())
app.use(limiter)

//middlware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/tweets', tweetRoutes);
app.use('/follow', followRoutes);
app.use('/notifications', notificationRoutes);

//404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({message: 'Route not found'});
})

//global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
console.error(err.stack);
res.status(500).json({message: err.message});
})




// Connect to MongoDB then start server
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB connected')
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.error('MongoDB connection failed:', err)
        process.exit(1)
    })

export default app