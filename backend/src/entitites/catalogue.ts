import {Schema,model,Model} from "mongoose"
import {IMongo_Entity} from "./mongo_entity";
import Site, {ISite} from "./site";
import {cascade_related} from "../utilities/trigger_factory";


//Schema
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

//Triggers

catalogueSchema.pre("findOneAndDelete", async function(next){
    await cascade_related<ICatalogue,ISite>(this.model,this.getFilter(),Site,"catalogue_id");
    next();
});

const Catalogue:CatalogueModel = model<ICatalogue,CatalogueModel>('Catalogue',catalogueSchema);

export default Catalogue;
