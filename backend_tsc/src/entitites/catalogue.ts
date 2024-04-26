import {Schema,model,Model} from "mongoose"
import {IMongo_Entity} from "./mongo_entity";
import Site, {ISite} from "./site";
import {cascade_related} from "../utilities/trigger_factory";

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

/**
 * Cascade delete related sites
 */
catalogueSchema.pre("findOneAndDelete", async function(next){
    await cascade_related<ICatalogue,ISite>(this.model,this.getFilter(),Site,"catalogue_id");
    next();
});

catalogueSchema.pre("deleteOne", async function(next){
    let self = await this.model.findOne(this.getFilter());
    await cascade_related<ICatalogue,ISite>(this.model,this.getFilter(),Site,"catalogue_id");
    next();
});

// Idea calling
//cascade_delete<CascadeMe>("triggeringMethod",schema)
//cascade_update<CascadeMe>("triggeringMethod",update)


const Catalogue:CatalogueModel = model<ICatalogue,CatalogueModel>('Catalogue',catalogueSchema);

export default Catalogue;
