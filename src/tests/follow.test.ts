import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'

async function createUser(username: string) {
    await request(app).post('/auth/register').send({
        username,
        name: username,
        email: `${username}@test.com`,
        password: 'abc123'
    })
    const login = await request(app).post('/auth/login').send({
        username,
        password: 'abc123'
    })
    const search = await request(app).get(`/users/search?q=${username}`)
    return { token: login.body.token as string, id: search.body[0]._id as string }
}

const auth = (token: string) => ({ Authorization: `Bearer ${token}` })

describe('POST /follow/:id/follow', () => {
    it('should follow a user', async () => {
        const alice = await createUser('alice')
        const bob = await createUser('bob')

        const res = await request(app)
            .post(`/follow/${bob.id}/follow`)
            .set(auth(alice.token))
        expect(res.status).toBe(200)
        expect(res.body.message).toBe('You just followed bob')

        const followers = await request(app)
            .get(`/follow/${bob.id}/followers`)
            .set(auth(alice.token))
        expect(followers.body.map((u: { _id: string }) => u._id)).toEqual([alice.id])

        const following = await request(app)
            .get(`/follow/${alice.id}/following`)
            .set(auth(alice.token))
        expect(following.body.map((u: { _id: string }) => u._id)).toEqual([bob.id])
    })

    it('should not follow yourself', async () => {
        const alice = await createUser('alice')

        const res = await request(app)
            .post(`/follow/${alice.id}/follow`)
            .set(auth(alice.token))
        expect(res.status).toBe(401)
    })

    it('should not follow the same user twice', async () => {
        const alice = await createUser('alice')
        const bob = await createUser('bob')

        await request(app).post(`/follow/${bob.id}/follow`).set(auth(alice.token))
        const res = await request(app).post(`/follow/${bob.id}/follow`).set(auth(alice.token))
        expect(res.status).toBe(400)
    })

    it('should return 404 for a user that does not exist', async () => {
        const alice = await createUser('alice')

        const res = await request(app)
            .post('/follow/64b000000000000000000000/follow')
            .set(auth(alice.token))
        expect(res.status).toBe(404)
    })

    it('should return 401 without a token', async () => {
        const bob = await createUser('bob')

        const res = await request(app).post(`/follow/${bob.id}/follow`)
        expect(res.status).toBe(401)
    })
})

describe('POST /follow/:id/unfollow', () => {
    it('should unfollow a user', async () => {
        const alice = await createUser('alice')
        const bob = await createUser('bob')

        await request(app).post(`/follow/${bob.id}/follow`).set(auth(alice.token))
        const res = await request(app)
            .post(`/follow/${bob.id}/unfollow`)
            .set(auth(alice.token))
        expect(res.status).toBe(200)
        expect(res.body.message).toBe('You just unfollowed bob')

        const followers = await request(app)
            .get(`/follow/${bob.id}/followers`)
            .set(auth(alice.token))
        expect(followers.body).toEqual([])
    })

    it('should return 400 when not following the user', async () => {
        const alice = await createUser('alice')
        const bob = await createUser('bob')

        const res = await request(app)
            .post(`/follow/${bob.id}/unfollow`)
            .set(auth(alice.token))
        expect(res.status).toBe(400)
    })

    it('should not unfollow yourself', async () => {
        const alice = await createUser('alice')

        const res = await request(app)
            .post(`/follow/${alice.id}/unfollow`)
            .set(auth(alice.token))
        expect(res.status).toBe(401)
    })
})
