 import type { Request, Response } from 'express'
import { getErrorMessage } from '../utils/error.js';
import User from '../models/User.js';

export async function getUsers(req: Request, res: Response) {
   try {

    const users = await User.find({});
    res.status(200).json(users);
   } catch (error) {
    res.status(500).json({message: getErrorMessage(error)});
   }


}

export async function getUserById (req: Request, res: Response){
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({message: getErrorMessage(error)});
    }
}






export async function deleteUser(req: Request, res: Response){
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({message: 'User deleted'});
    } catch (error) {
        res.status(500).json({message: getErrorMessage(error)});
    }
    }