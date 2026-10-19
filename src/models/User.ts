import mongoose, {Schema, Types, model, type Document} from "mongoose";
import type { ITweet } from "./Tweet.js";

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin'
}


export interface IUser extends Document{
    username: string;
    name: string;
    email: string;
    tweets: Types.ObjectId[] | ITweet [];
    following: Types.ObjectId [] ;
    followers: Types.ObjectId [] ;
    password: string;
    role: UserRole,
    createdAt: Date;

}

//people: [{array: User}]

const UserSchema = new Schema<IUser>({
    username: {type: String, required: true, unique: true},
    name: {type: String, required: true, unique: false},
    email: {type: String, required: false, unique: true},
    tweets: [{type: Schema.Types.ObjectId, ref: 'Tweet'}] ,
    following: [{type: Schema.Types.ObjectId, ref: 'User'}],
    followers: [{type: Schema.Types.ObjectId, ref: 'User'}],
    password: {type: String, required: true},
    role: {type: String, enum: Object.values(UserRole), default: UserRole.USER},
    createdAt:{type: Date, default: Date.now}
})

export default mongoose.model<IUser>('User', UserSchema);
