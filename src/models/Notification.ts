import mongoose, {Schema, model, type Document} from "mongoose";
import User from "./User.js";

export interface INotification extends Document {
    content: string;
     createdAt: Date;
    NotificationActor: object;
}

const NotificationSchema = new Schema <INotification>({
    content: {type: String, required: true},
    createdAt:{type: Date, default: Date.now},
    NotificationActor: {type: User, required: true}
})
