import {Schema,model,Model,Types} from "mongoose"
import {IMongo_Entity} from "./mongo_entity";

export interface ICatalogue extends IMongo_Entity{
   name: string,
   description: string
}

type CatalogueModel = Model<ICatalogue>;
const catalogueSchema = new Schema<ICatalogue,CatalogueModel>({
    name:{type:String, required:true,trim:true},
    description:{type:String, required:false},
},{
    timestamps:true,
});

const Catalogue:CatalogueModel = model<ICatalogue,CatalogueModel>('Catalogue',catalogueSchema);

export default Catalogue;
