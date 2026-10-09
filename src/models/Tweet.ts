import mongoose, {Schema, model, type Document} from "mongoose";
import User from "./User.js";

export interface ITweet extends Document {
    content: string;
    charNumbers: number;    //make it <= 80
     createdAt: Date;
    postedBy: object;
}

const TweetSchema = new Schema <ITweet>({
    content: {type: String, required: true},
    charNumbers: {type: Number, required: true},
    createdAt:{type: Date, default: Date.now},
    postedBy: {type: User, required: true}
})


