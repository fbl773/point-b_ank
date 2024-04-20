import {Schema} from "mongoose"

interface ICatalogue{
   name: string,
   description: string
}

const catalogueSchema = new Schema<ICatalogue>({
    name:{type:String, required:true},
    description:{type:String, required:false},
});

export default catalogueSchema;
