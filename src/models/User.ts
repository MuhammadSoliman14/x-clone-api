import mongoose, {Schema, model, type Document} from "mongoose";

export interface IUser extends Document{
    username: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;

}


const UserSchema = new Schema<IUser>({
    username: {type: String, required: true, unique: true},
    name: {type: String, required: true, unique: false},
    email: {type: String, required: false, unique: true},
    password: {type: String, requried: true},
    createdAt:{type: Date, default: Date.now}
})

export default mongoose.model<IUser>('User', UserSchema);
