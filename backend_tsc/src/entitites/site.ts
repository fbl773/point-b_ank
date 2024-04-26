import {Schema,Types,Model,model} from "mongoose"
import {IMongo_Entity} from "./mongo_entity";
import Catalogue from "./catalogue";
import Region from "./region";

export interface ISite extends IMongo_Entity{
    name: string,
    description: string,
    catalogue_id: Types.ObjectId
    region_id: Types.ObjectId
}

type SiteModal = Model<ISite>;
const siteSchema = new Schema<ISite,SiteModal>({
    name:{type:String, required:true},
    description:{type:String, required:false},
    catalogue_id:{type: Schema.Types.ObjectId, ref:"Catalogue",required:true},//TODO using actual models should not break...
    region_id:{type: Schema.Types.ObjectId, ref:"Region",required:true}

},{timestamps:true});

/**
 * Cascade delete related artifacts
 */
// siteSchema.pre("findOneAndDelete", async function(next){
//     let self = await this.model.findOne(this.getFilter());
//     await Artifact.deleteMany({site_id:self._id});
//     next();
// })

const Site:SiteModal = model<ISite,SiteModal>('Site',siteSchema);

export default Site;
