import mongoose, {Schema, Types, type Document} from "mongoose";

export interface IFeed extends Document {
    userId: Types.ObjectId;
    tweetId: Types.ObjectId;
    createdAt: Date;
} 

const feedSchema = new Schema <IFeed> ({
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    tweetId: {type: Schema.Types.ObjectId, ref:'Tweet', required: true},
     createdAt: {type: Date, default: Date.now}
    })