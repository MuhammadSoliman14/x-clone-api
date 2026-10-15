import mongoose, {Schema,Types, model, type Document} from "mongoose";
import User from "./User.js";

export interface ITweet extends Document {
    content: string;
    likes: number;
    bookmarks: number;
     createdAt: Date;
    postedBy: Types.ObjectId;
}

const TweetSchema = new Schema <ITweet>({
    content: {type: String, required: true},
    // charNumbers: {type: Number, required: true},
    likes: {type: Number, default: 0},
    bookmarks: {type: Number, default: 0},
    createdAt:{type: Date, default: Date.now},
    postedBy: {type: Schema.Types.ObjectId, ref: 'User', required: true}
})

export default mongoose.model<ITweet>('Tweet', TweetSchema);
