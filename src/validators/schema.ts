import { z } from 'zod'

export const registerSchema = z.object({
    username: z.string().min(3).max(20),
    name: z.string().min(1).max(50),
    email: z.string().email(),
    password: z.string().min(6)
})

export const loginSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1)
})

export const tweetSchema = z.object({
    content: z.string().min(1).max(280)
})