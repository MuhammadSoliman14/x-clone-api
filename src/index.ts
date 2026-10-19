import express from 'express';
import type { NextFunction, Request , Response } from 'express';
import mongoose from'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import tweetRoutes from './routes/tweetRoutes.js';
import followRoutes from './routes/followRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config()
const app = express();
const PORT =8080;

const MONGO_URI = process.env.MONGO_URI || ''

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