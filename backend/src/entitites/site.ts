import {Schema,Types,Model,model} from "mongoose"
import {IMongo_Entity} from "./mongo_entity";
import Catalogue from "./catalogue";
import Region from "./region";
import ProjectilePoint, {IProjectilePoint} from "./projectile_point";
import {cascade_related} from "../utilities/trigger_factory";


//Schema
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
    catalogue_id:{type: Schema.Types.ObjectId, ref:"Catalogue",required:true},
    region_id:{type: Schema.Types.ObjectId, ref:"Region",required:true}

},{timestamps:true});

const Site:SiteModal = model<ISite,SiteModal>('Site',siteSchema);

//Triggers
/*  Cascade delete related artifacts */
siteSchema.pre("findOneAndDelete", async function(next) {
    await cascade_related<ISite, IProjectilePoint>(this.model, this.getFilter(), ProjectilePoint, "site_id");
    next();
});


export default Site;