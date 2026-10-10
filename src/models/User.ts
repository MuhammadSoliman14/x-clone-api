import mongoose, {Schema, Types, model, type Document} from "mongoose";
import type { ITweet } from "./Tweet.js";
import { array } from "node:stream/iter";

export interface IUser extends Document{
    username: string;
    name: string;
    email: string;
    tweets: Types.ObjectId[] | ITweet [];
    password: string;
    createdAt: Date;

}

//people: [{array: User}]

const UserSchema = new Schema<IUser>({
    username: {type: String, required: true, unique: true},
    name: {type: String, required: true, unique: false},
    email: {type: String, required: false, unique: true},
     tweets: [{type: Schema.Types.ObjectId, ref: 'Tweet'}] ,
    password: {type: String, requried: true},
    createdAt:{type: Date, default: Date.now}
})

export default mongoose.model<IUser>('User', UserSchema);
