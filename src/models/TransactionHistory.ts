import { type } from "os";

export default interface TransactionHistory {
    _id:number;
    userId:number;
    balance:number;
    amount:number;
    type:string;
    createdAt:Date
}