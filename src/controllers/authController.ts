import type { Request, Response } from 'express'
import { getErrorMessage } from '../utils/error.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User, { UserRole} from '../models/User.js'


export async function register (req: Request, res: Response){
    try {
        const {username, password, name, email, role} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({username, password: hashedPassword, role: UserRole.USER, email, name});
        res.status(201).json({message: 'User Created'});
    } catch (error){
        res.status(500).json({message: getErrorMessage(error)});
    }
}


export async function login (req: Request, res: Response){
    try{
        const {username, password} = req.body;
        const user = await User.findOne({username});  //filter object
        if (! user || !(await bcrypt.compare(password, user.password))){
            return res.status(401).json({message: "Invalid username or password"});
        }
        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET as string, {expiresIn: '7d'});
        return res.status(200).json({token});
    } catch (error){
        res.status(500).json({message: getErrorMessage(error)});
    }
}