import mongoose, {Schema, model, type Document} from "mongoose";
import User from "./User.js";
import type {IList} from "./sharedList.js"




const FollowersSchema = new Schema <IList>({
    count: {type: Number, required: true},
    
    people: [{type: Schema.Types.ObjectId, ref: 'User'}]
})

export default mongoose.model<IList>('FollowersList', FollowersSchema);


