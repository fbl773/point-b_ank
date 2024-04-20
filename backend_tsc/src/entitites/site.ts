import {Schema,Types} from "mongoose"

interface ISite{
    name: string,
    description: string,
    catalogue_id: Types.ObjectId
}

const siteSchema = new Schema<ISite>({
    name:{type:String, required:true},
    description:{type:String, required:false},
    catalogue_id:{type: Schema.Types.ObjectId, ref:"Catalogue"}

});

export default siteSchema;
