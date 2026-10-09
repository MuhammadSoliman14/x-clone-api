import mongoose, {Schema, model, type Document} from "mongoose";
import User from "./User.js";
import type {IList} from "./sharedList.js"




const FollowingSchema = new Schema <IList>({
    count: {type: Number, required: true},
    
    people: [{array: User}]
})


export default mongoose.model<IList>('FollowingList, FollowingSchema')
