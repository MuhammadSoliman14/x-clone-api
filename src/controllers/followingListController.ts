import type { Request, Response } from 'express'
import { getErrorMessage } from '../utils/error.js';
const FollowersList = require('../models/FollowingList');
const User = require('../models/User');

export async function getAllFollowingForUser(req: Request, res: Response){
   try {
        const user = await User.findById(req.params.id).populate('following');
        if (! user){
            res.status(404).json({message: 'user not found'});
        }
    } catch (error){
        res.status(500).json({message: getErrorMessage(error)});
    }

}


// export async function FollowSomeone(req: Request, res: Response){
//     try {
//         const user = await User.findById(req.params.id);
        
//     }
// }


