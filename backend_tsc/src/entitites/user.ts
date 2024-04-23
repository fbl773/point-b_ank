import {Schema,model,Model} from "mongoose"
import {IMongo_Entity} from "./mongo_entity";

export interface IUser extends IMongo_Entity{
    username:string,
    password:string,
    active:boolean
    role:string

}

type UserModel = Model<IUser>;
const userSchema= new Schema<IUser,UserModel>({
    username:{type:String, required:true,trim:true},
    password:{type:String, required:true,trim:true},
    active:{type:Boolean, required:true, default:true},
    role:{type:String,required:true,enum:["admin","tester"]}//wtf is tester?
},{
    timestamps:true,
});

const User:UserModel= model<IUser,UserModel>('User',userSchema);

export default User;
