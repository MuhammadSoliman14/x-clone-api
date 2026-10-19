import Notification from "../models/Notification.js";
import { Types } from "mongoose";

interface NotificationPayload {
    recipient: string;
    actor: string;
    content: string;
}

export async function createNotification({ recipient, actor, content }: NotificationPayload) {
    await Notification.create({
        recipient: new Types.ObjectId(recipient),
        actor: new Types.ObjectId(actor),
        content,
    });
}
