import type { IUser } from "./User.js";

export interface IList {
    count: number,
    people: IUser[];
}