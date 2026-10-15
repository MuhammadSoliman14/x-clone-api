import type { Request, Response } from 'express'
import { getErrorMessage } from '../utils/error.js';
// import FollowersList from '../models/FollowingLis.js'; 
import User from '../models/User.js';

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


