import type {Request, Response} from 'express';
import {Types} from 'mongoose';
import { getErrorMessage } from '../utils/error.js';
import Notification from '../models/Notification.js';

export async function getNotification (req: Request, res: Response){
    try{
        const notifications = await Notification.find({recipient: new Types.ObjectId(req.user!.id)})
        .populate('actor', 'username')
        .sort({createdAt: -1});
        res.status(200).json(notifications);

    }
    catch (error){
        res.status(500).json({message: getErrorMessage(error)});
    }
}

export async function markAsRead (req: Request, res: Response){
    try{
        // filter by recipient so users can only mark their own notifications
        const notification = await Notification.findOneAndUpdate(
            {_id: req.params.id as string, recipient: req.user!.id},
            {isRead: true},
            {new: true}
        );
        if (!notification) return res.status(404).json({message: 'Notification not found'});
        res.status(200).json(notification);
    }
    catch (error){
        res.status(500).json({message: getErrorMessage(error)});
    }
}

export async function markAllAsRead (req: Request, res: Response){
    try{
        await Notification.updateMany({recipient: req.user!.id, isRead: false}, {isRead: true});
        res.status(200).json({message: 'All notifications marked as read'});
    }
    catch (error){
        res.status(500).json({message: getErrorMessage(error)});
    }
}
