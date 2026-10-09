import type { Request, Response } from 'express'
import { getErrorMEssage } from '../utils/error.js';
import { get } from 'mongoose';
const User = require('../models/User');

export async function getUsers(req: Request, res: Response) {
   try {

    const users = await User.find({});
    res.status(200).json(users);
   } catch (error) {
    res.status(500).json({message: getErrorMEssage(error)});
   }


}

export async function getUserById (req: Request, res: Response){
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: getErrorMEssage(error)});
    }
}



export async function createUser(req: Request, res: Response){
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({message: getErrorMEssage(error)});
    }
}


export async function deleteUser(req: Request, res: Response){
    try {
        await User.findByIdandDelete(req.params.id);
        res.status(200).json({message: 'User deleted'});
    } catch (error) {
        res.status(500).json({message: getErrorMEssage(error)});
    }
}