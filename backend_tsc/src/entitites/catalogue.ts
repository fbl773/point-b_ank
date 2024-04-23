import {Schema,model,Model,Types} from "mongoose"
import {IMongo_Entity} from "./mongo_entity";
import catalogue_router from "../routes/catalogue";
import Site from "./site";

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
    let self = await this.model.findOne(this.getFilter());
    await Site.deleteMany({catalogue_id:self._id});
    next();
})
const Catalogue:CatalogueModel = model<ICatalogue,CatalogueModel>('Catalogue',catalogueSchema);

export default Catalogue;
