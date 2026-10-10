import type { Request, Response } from 'express'
import { getErrorMEssage } from '../utils/error.js';
import { get } from 'mongoose';
const Tweet = require('../models/Tweet');
const User = require('../models/User');

export async function getAllTweetsForUser(req: Request, res: Response){
    try {
        const user = await User.findById(req.params.id).populate('tweets');
        if (!user){
            return res.status(404).json({message: "user not found"});
        }
        res.status(200).json(user.tweets)
    } catch  (error) {
        res.status(500).json({message: getErrorMEssage(error)});
    }
}


export async function getTweet(req: Request, res: Response){
    try {
        const tweet = await Tweet.findById(req.params.id);
        res.status(200).json(tweet);

    } catch (error){
        res.status(500).json({message: getErrorMEssage(error)});
    }

}

export async function createTweet (req: Request, res: Response){
    try {
        const tweet = await Tweet.create(req.body);
             res.status(200).json(tweet);

    } catch (error){
        res.status(500).json({message: getErrorMEssage(error)});
    }
        }



  
export async function deleteTweet(req: Request, res: Response) {
    try {
        const tweet = await Tweet.findByIdandDelete(req.params.id);
        res.status(200).json("Tweet have been deleted");

    } catch(error){
        res.status(500).json({message: getErrorMEssage(error)});
    }
    
}

export async function likeTweet (req: Request, res: Response){
    try {
        const tweet = await Tweet.findById(req.params.id);
        if (! tweet){
            return res.status(404).json({message: "tweet not found"});
        }
        tweet.likes +=1 ;
    } catch (error) {
        res.status(500).json({message: getErrorMEssage(error)});
    }
}


export async function unLikeTweet (req: Request, res: Response){
    try {
        const tweet = await Tweet.findById(req.params.id);
        if (! tweet){
            return res.status(404).json({message: "tweet not found"});
        }
        tweet.likes -=1 ;
    } catch (error) {
        res.status(500).json({message: getErrorMEssage(error)});
    }
}


export async function bookmarkTweet (req: Request, res: Response){
    try {
        const tweet = await Tweet.findById(req.params.id);
        if (! tweet){
            return res.status(404).json({message: "tweet not found"});
        }
        tweet.bookmarks +=1 ;
    } catch (error) {
        res.status(500).json({message: getErrorMEssage(error)});
    }
}


export async function unBookmarkTweet (req: Request, res: Response){
    try {
        const tweet = await Tweet.findById(req.params.id);
        if (! tweet){
            return res.status(404).json({message: "tweet not found"});
        }
        tweet.bookmarks -=1 ;
    } catch (error) {
        res.status(500).json({message: getErrorMEssage(error)});
    }
}

