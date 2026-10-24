import express from 'express'
import type { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import tweetRoutes from './routes/tweetRoutes.js'
import followRoutes from './routes/followRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'

const app = express()

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: 'Too many requests, please try again in a while' }
})

app.use(helmet())
app.use(cors())
app.use(limiter)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/tweets', tweetRoutes)
app.use('/follow', followRoutes)
app.use('/notifications', notificationRoutes)

app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Route not found' })
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack)
    res.status(500).json({ message: err.message })
})

export default app