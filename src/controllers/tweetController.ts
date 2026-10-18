import type { Request, Response } from 'express'
import { getErrorMessage } from '../utils/error.js';
import { Types } from 'mongoose';
import Tweet from '../models/Tweet.js';
import User from '../models/User.js';

export async function getAllTweetsForUser(req: Request, res: Response){
    try {
        const user = await User.findById(req.params.id).populate('tweets');
        if (!user){
            return res.status(404).json({message: "user not found"});
        }
        res.status(200).json(user.tweets)
    } catch  (error) {
        res.status(500).json({message: getErrorMessage(error)});
    }
}


export async function getTweet(req: Request, res: Response){
    try {
        const tweet = await Tweet.findById(req.params.id);
        if (! tweet) return res.status(404).json({message: "tweet not found"})
        res.status(200).json(tweet);

    } catch (error){
        res.status(500).json({message: getErrorMessage(error)});
    }

}

export async function createTweet (req: Request, res: Response){
    try {
        const {content} = req.body;
        const tweet = await Tweet.create({
            content: content,
            postedBy: new Types.ObjectId (req.user?.id)
        })

        await User.findByIdAndUpdate(
            req.user?.id, {
                $push: {
                    tweets: tweet._id
                }
            }
        )
             res.status(200).json(tweet);

    } catch (error){
        res.status(500).json({message: getErrorMessage(error)});
    }
        }


//   await User.findByIdAndUpdate(
//                   targetId, {
//                        $push: {
//                            followers: req.user?.id
//                        }
//                    }
//                )
  
export async function deleteTweet(req: Request, res: Response) {
    try {
        const tweet = await Tweet.findByIdAndDelete(req.params.id);
        if (! tweet) return res.status(404).json({message: 'tweet not found'})
       
            await User.findByIdAndUpdate(
            req.user?.id, {
            $pull: {
                tweets: tweet._id
            }
         })
        res.status(200).json({message:"Tweet have been deleted"});

    } catch(error){
        res.status(500).json({message: getErrorMessage(error)});
    }
    
}

export async function likeTweet (req: Request, res: Response){
    try {
        const tweet = await Tweet.findById(req.params.id);
        if (! tweet){
            return res.status(404).json({message: "tweet not found"});
        }
        tweet.likes +=1;
        await tweet.save();
        res.status(200).json({message: 'Tweet was liked successfully'});
    } catch (error) {
        res.status(500).json({message: getErrorMessage(error)});
    }
}


export async function unLikeTweet (req: Request, res: Response){
    try {
        const tweet = await Tweet.findById(req.params.id);
        if (! tweet){
            return res.status(404).json({message: "tweet not found"});
        }
        tweet.likes -=1 ;
        await tweet.save();
        res.status(200).json({message: 'Tweet was unliked successfully'});
    } catch (error) {
        res.status(500).json({message: getErrorMessage(error)});
    }
}


export async function bookmarkTweet (req: Request, res: Response){
    try {
        const tweet = await Tweet.findById(req.params.id);
        if (! tweet){
            return res.status(404).json({message: "tweet not found"});
        }
        tweet.bookmarks +=1 ;
        await tweet.save();
        res.status(200).json({message: 'Tweet was bookmarked successfully'});
    } catch (error) {
        res.status(500).json({message: getErrorMessage(error)});
    }
}


export async function unBookmarkTweet (req: Request, res: Response){
    try {
        const tweet = await Tweet.findById(req.params.id);
        if (! tweet){
            return res.status(404).json({message: "tweet not found"});
        }
        tweet.bookmarks -=1 ;
        await tweet.save();
        res.status(200).json({message: 'Tweet was unbookmarked successfully'});
    } catch (error) {
        res.status(500).json({message: getErrorMessage(error)});
    }
}



