import {Schema,model,Model,Types} from "mongoose"

export interface IUser{
    _id:Types.ObjectId,
    username:string,
    password:string,
    active:boolean
    role:string

}

type UserModel = Model<IUser>;
const userSchema= new Schema<IUser,UserModel>({
    username:{type:String, required:true},
    password:{type:String, required:true},
    active:{type:Boolean, required:true, default:true},
    role:{type:String,required:true,enum:["admin","tester"]}//wtf is tester?
},{
    timestamps:true,
});

const User:UserModel= model<IUser,UserModel>('User',userSchema);

export default User;
