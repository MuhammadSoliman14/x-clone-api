import mongoose, { Schema, Types, type Document } from "mongoose";

export interface INotification extends Document {
    content: string;
    createdAt: Date;
    actor: Types.ObjectId;
    recipient: Types.ObjectId;
    isRead: boolean;
}

const NotificationSchema = new Schema<INotification>({
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    actor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isRead: { type: Boolean, default: false },
});

export default mongoose.model<INotification>("Notification", NotificationSchema);