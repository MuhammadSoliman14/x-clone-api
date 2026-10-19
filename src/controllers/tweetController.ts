import type { Request, Response } from 'express'
import { getErrorMessage } from '../utils/error.js'
import { Types } from 'mongoose'
import Tweet from '../models/Tweet.js'
import User from '../models/User.js'
import { createNotification } from '../utils/notification.js'

export async function getAllTweetsForUser(req: Request, res: Response) {
    try {
        const user = await User.findById(req.params.id as string).populate('tweets')
        if (!user) return res.status(404).json({ message: 'User not found' })
        res.status(200).json(user.tweets)
    } catch (error) {
        res.status(500).json({ message: getErrorMessage(error) })
    }
}

export async function getTweet(req: Request, res: Response) {
    try {
        const tweet = await Tweet.findById(req.params.id as string)
        if (!tweet) return res.status(404).json({ message: 'Tweet not found' })
        res.status(200).json(tweet)
    } catch (error) {
        res.status(500).json({ message: getErrorMessage(error) })
    }
}

export async function createTweet(req: Request, res: Response) {
    try {
        const { content } = req.body
        const tweet = await Tweet.create({
            content,
            postedBy: new Types.ObjectId(req.user!.id)
        })
        await User.findByIdAndUpdate(req.user!.id, {
            $push: { tweets: tweet._id }
        })
        res.status(201).json(tweet)
    } catch (error) {
        res.status(500).json({ message: getErrorMessage(error) })
    }
}

export async function deleteTweet(req: Request, res: Response) {
    try {
        const tweet = await Tweet.findById(req.params.id as string)
        if (!tweet) return res.status(404).json({ message: 'Tweet not found' })
        await Tweet.findByIdAndDelete(req.params.id)
        await User.findByIdAndUpdate(req.user!.id, {
            $pull: { tweets: tweet._id }
        })
        res.status(200).json({ message: 'Tweet deleted' })
    } catch (error) {
        res.status(500).json({ message: getErrorMessage(error) })
    }
}

export async function likeTweet(req: Request, res: Response) {
    try {
        const currentUserId = req.user!.id
        const currentUser = await User.findById(currentUserId)
        const tweet = await Tweet.findById(req.params.id as string)
        if (!tweet) return res.status(404).json({ message: 'Tweet not found' })
        tweet.likes += 1
        await tweet.save()
        await createNotification({
            recipient: tweet.postedBy.toString(),
            actor: currentUserId,
            content: `${currentUser!.username} liked your tweet`
        })
        res.status(200).json({ message: 'Tweet liked successfully' })
    } catch (error) {
        res.status(500).json({ message: getErrorMessage(error) })
    }
}

export async function unLikeTweet(req: Request, res: Response) {
    try {
        const tweet = await Tweet.findById(req.params.id as string)
        if (!tweet) return res.status(404).json({ message: 'Tweet not found' })
        tweet.likes -= 1
        await tweet.save()
        res.status(200).json({ message: 'Tweet unliked successfully' })
    } catch (error) {
        res.status(500).json({ message: getErrorMessage(error) })
    }
}

export async function bookmarkTweet(req: Request, res: Response) {
    try {
        const tweet = await Tweet.findById(req.params.id as string)
        if (!tweet) return res.status(404).json({ message: 'Tweet not found' })
        tweet.bookmarks += 1
        await tweet.save()
        res.status(200).json({ message: 'Tweet bookmarked successfully' })
    } catch (error) {
        res.status(500).json({ message: getErrorMessage(error) })
    }
}

export async function unBookmarkTweet(req: Request, res: Response) {
    try {
        const tweet = await Tweet.findById(req.params.id as string)
        if (!tweet) return res.status(404).json({ message: 'Tweet not found' })
        tweet.bookmarks -= 1
        await tweet.save()
        res.status(200).json({ message: 'Tweet unbookmarked successfully' })
    } catch (error) {
        res.status(500).json({ message: getErrorMessage(error) })
    }
}