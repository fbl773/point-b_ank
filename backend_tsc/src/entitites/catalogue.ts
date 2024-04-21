import {Schema,model,Model,Types} from "mongoose"

export interface ICatalogue{
   _id:Types.ObjectId,
   name: string,
   description: string
}

type CatalogueModel = Model<ICatalogue>;
const catalogueSchema = new Schema<ICatalogue,CatalogueModel>({
    name:{type:String, required:true,trim:true},
    description:{type:String, required:false},
},{
    timestamps:true,
    collection:"catalogue"
});

const Catalogue:CatalogueModel = model<ICatalogue,CatalogueModel>('Catalogue',catalogueSchema);

export default Catalogue;
