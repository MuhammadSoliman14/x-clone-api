import dotenv from 'dotenv'
import mongoose from 'mongoose'
import app from './app.js'

dotenv.config()

if (!process.env.MONGO_URI) { console.error('MONGO_URI not set'); process.exit(1) }
if (!process.env.JWT_SECRET) { console.error('JWT_SECRET not set'); process.exit(1) }

const PORT = process.env.PORT || 8080
const MONGO_URI = process.env.MONGO_URI

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