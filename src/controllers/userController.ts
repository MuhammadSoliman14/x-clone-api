 import type { Request, Response } from 'express'
import { getErrorMessage } from '../utils/error.js';
import User from '../models/User.js';

export async function getUsers(req: Request, res: Response) {
   try {

    const users = await User.find({}).select('-password');
    res.status(200).json(users);
   } catch (error) {
    res.status(500).json({message: getErrorMessage(error)});
   }


}

export async function getUserById (req: Request, res: Response){
    try {
        const user = await User.findById(req.params.id)
        .select('-password')
        .populate('tweets')
        if (!user) return res.status(404).json({message: 'User not found'});
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: getErrorMessage(error)});
    }
}






export async function deleteUser(req: Request, res: Response){
    try {
        // only the account owner or an admin can delete an account
        if (req.user!.id !== req.params.id && req.user!.role !== 'admin') {
            return res.status(403).json({message: 'access denied'});
        }
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({message: 'User not found'});
        res.status(200).json({message: 'User deleted'});
    } catch (error) {
        res.status(500).json({message: getErrorMessage(error)});
    }
    }