import type { Document } from "mongoose";
import type { IUser } from "./User.js";

export interface IList extends Document {
    count: number,
    people: IUser[];
}