import type { Request, Response } from 'express'
import { getErrorMEssage } from '../utils/error.js';
import { get } from 'mongoose';
import { request } from 'node:http';
import { error } from 'node:console';
const FollowersList = require('../models/FollowingList');
const User = require('../models/User');

export async function getAllFollowingForUser(req: Request, res: Response){
   try {
        const user = await User.findById(req.params.id).populate('following');
        if (! user){
            res.status(404).json({message: 'user not found'});
        }
    } catch (error){
        res.status(500).json({message: getErrorMEssage(error)});
    }

}


// export async function FollowSomeone(req: Request, res: Response){
//     try {
//         const user = await User.findById(req.params.id);
        
//     }
// }


