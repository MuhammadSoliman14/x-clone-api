import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { beforeAll, afterAll, afterEach } from 'vitest'

process.env.JWT_SECRET ||= 'test-secret'

let mongo: MongoMemoryServer

beforeAll(async () => {
    mongo = await MongoMemoryServer.create()
    await mongoose.connect(mongo.getUri())
}, 60000)

afterEach(async () => {
    const collections = mongoose.connection.collections
    for (const key in collections) {
        await collections[key].deleteMany({})
    }
})

afterAll(async () => {
    await mongoose.disconnect()
    await mongo.stop()
})
