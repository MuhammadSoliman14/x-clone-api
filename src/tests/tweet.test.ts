import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'

async function createUserAndLogin(username: string) {
    await request(app).post('/auth/register').send({
        username,
        name: username,
        email: `${username}@test.com`,
        password: 'abc123'
    })
    const res = await request(app).post('/auth/login').send({
        username,
        password: 'abc123'
    })
    return res.body.token as string
}

describe('POST /tweets', () => {
    it('should create a tweet and return 201', async () => {
        const token = await createUserAndLogin('soliman')
        const res = await request(app)
            .post('/tweets')
            .set('Authorization', `Bearer ${token}`)
            .send({ content: 'Hello world' })
        expect(res.status).toBe(201)
        expect(res.body.content).toBe('Hello world')
    })

    it('should return 400 if content is missing', async () => {
        const token = await createUserAndLogin('soliman')
        const res = await request(app)
            .post('/tweets')
            .set('Authorization', `Bearer ${token}`)
            .send({})
        expect(res.status).toBe(400)
    })

    it('should return 401 if no token', async () => {
        const res = await request(app)
            .post('/tweets')
            .send({ content: 'Hello world' })
        expect(res.status).toBe(401)
    })
})

describe('GET /tweets/:id', () => {
    it('should return the tweet', async () => {
        const token = await createUserAndLogin('soliman')
        const created = await request(app)
            .post('/tweets')
            .set('Authorization', `Bearer ${token}`)
            .send({ content: 'Test tweet' })
        const res = await request(app)
            .get(`/tweets/${created.body._id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(200)
        expect(res.body.content).toBe('Test tweet')
    })
})

describe('POST /tweets/:id/like', () => {
    it('should like a tweet and return 200', async () => {
        const token = await createUserAndLogin('soliman')
        const tweet = await request(app)
            .post('/tweets')
            .set('Authorization', `Bearer ${token}`)
            .send({ content: 'Like me' })
        const res = await request(app)
            .post(`/tweets/${tweet.body._id}/like`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(200)
        expect(res.body.message).toBe('Tweet liked successfully')
    })

    it('should not double-like a tweet', async () => {
        const token = await createUserAndLogin('soliman')
        const tweet = await request(app)
            .post('/tweets')
            .set('Authorization', `Bearer ${token}`)
            .send({ content: 'Like me' })
        await request(app)
            .post(`/tweets/${tweet.body._id}/like`)
            .set('Authorization', `Bearer ${token}`)
        const res = await request(app)
            .post(`/tweets/${tweet.body._id}/like`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(400)
        expect(res.body.message).toBe('You have already liked this tweet')
    })
})

describe('DELETE /tweets/:id', () => {
    it('should delete a tweet', async () => {
        const token = await createUserAndLogin('soliman')
        const tweet = await request(app)
            .post('/tweets')
            .set('Authorization', `Bearer ${token}`)
            .send({ content: 'Delete me' })
        const res = await request(app)
            .delete(`/tweets/${tweet.body._id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(200)
        expect(res.body.message).toBe('Tweet deleted')
    })
})