import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app'

describe('POST /auth/register', () => {
    it('should register a new user and return 201', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({ username: 'soliman', name: 'Soliman', email: 'sol@test.com', password: 'abc123' })

        expect(res.status).toBe(201)
        expect(res.body.message).toBe('User Created')
    })

    it('should return 400 if fields are missing', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({ username: 'soliman' })

        expect(res.status).toBe(400)
    })
})

describe('POST /auth/login', () => {
    it('should login and return a token', async () => {
        await request(app)
            .post('/auth/register')
            .send({ username: 'soliman', name: 'Soliman', email: 'sol@test.com', password: 'abc123' })

        const res = await request(app)
            .post('/auth/login')
            .send({ username: 'soliman', password: 'abc123' })

        expect(res.status).toBe(200)
        expect(res.body.token).toBeDefined()
    })

    it('should return 401 with wrong password', async () => {
        await request(app)
            .post('/auth/register')
            .send({ username: 'soliman', name: 'Soliman', email: 'sol@test.com', password: 'abc123' })

        const res = await request(app)
            .post('/auth/login')
            .send({ username: 'soliman', password: 'wrongpassword' })

        expect(res.status).toBe(401)
    })
})