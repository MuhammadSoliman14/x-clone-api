import type { Request, Response } from 'express'
import { getErrorMessage } from '../utils/error.js';
import {Types} from 'mongoose'; 
import User from '../models/User.js';
import { createNotification } from '../utils/notification.js';
import { Utf8Stream } from 'node:fs';


export async function getAllFollowingForUser(req: Request, res: Response){
   try {
        const user = await User.findById(req.params.id).populate('following');
        if (! user){
            return res.status(404).json({message: 'user not found'});
        } 
        res.status(200).json(user!.following)
    } catch (error){
        res.status(500).json({message: getErrorMessage(error)});
    }

}

export async function getAllFollowersForUser(req: Request, res: Response){
   try {
        const user = await User.findById(req.params.id).populate('followers');
        if (! user){
            return res.status(404).json({message: 'user not found'});
        }
        res.status(200).json(user!.followers)
    } catch (error){
        res.status(500).json({message: getErrorMessage(error)});
    }

}




export async function FollowSomeone(req: Request, res: Response){
    try {
        const targetId =  req.params.id as string;
        const currentUserId = req.user!.id ;
        const currentUser = await User.findById(currentUserId);
       // check if user tries to follow themselves
        if (targetId === currentUserId ){
            return res.status(401).json({message: 'you can not follow yourself' });
        }
        const targetUser = await User.findById(targetId);
        if (! targetUser) return res.status(404).json({message: 'user does not exist'});
         
        //check if already following 
        if (targetUser.followers.includes(new Types.ObjectId (req.user!.id))) {
           return res.status(400).json({message: "you already follow this user"});
        }

        
        // add current user to target followes
          await User.findByIdAndUpdate(
                  targetId, {
                       $push: {
                           followers: req.user?.id
                       }
                   }
               )
            
            // add to current user's following
            await User.findByIdAndUpdate(currentUserId, {
                $push: {following: targetId}
            })

                await createNotification({
                    recipient: targetId,
                    actor: currentUserId,
                    content: `${currentUser?.username} followed you`
                })



        
        res.status(200).json({ message: `You just followed ${targetUser.username}` })



    } catch (error){
        res.status(500).json({message: getErrorMessage(error)});
    }
}




export async function UnfollowSomeone(req: Request, res: Response){
    try {
        const targetId =  req.params.id as string;
        const currentUserId = req.user!.id ;
        const currentUser = await User.findById(currentUserId);
       // check if user tries to follow themselves
        if (targetId === currentUserId ){
           return res.status(401).json({message: 'you can not unfollow yourself' });
        }
        const targetUser = await User.findById(targetId);
        if (! targetUser) return res.status(404).json({message: 'user does not exist'});
         
        //check if already following 
        if ( ! targetUser.followers.includes(new Types.ObjectId (req.user!.id))) {
            return res.status(400).json({message: "you are already not following this user"});
        }

        
        // remove current user from target followes
          await User.findByIdAndUpdate(
                  targetId, {
                       $pull: {
                           followers: req.user?.id
                       }
                   }
               )
            
            // remove from current user's following
            await User.findByIdAndUpdate(currentUserId, {
                $pull: {following: targetId}
            })
        
             await createNotification({
                    recipient: targetId,
                    actor: currentUserId,
                    content: `${currentUser?.username} unfollowed you`
                })
        res.status(200).json({ message: `You just unfollowed ${targetUser.username}` })


    } catch (error){
        res.status(500).json({message: getErrorMessage(error)});
    }
}

