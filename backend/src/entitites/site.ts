import {Schema,Types,Model,model} from "mongoose"
import {IMongo_Entity} from "./mongo_entity";
import ProjectilePoint, {IProjectilePoint} from "./projectile_point";
import {cascade_related} from "../utilities/trigger_factory";


//Schema
export interface ISite extends IMongo_Entity{
    name: string,
    description: string,
    location: string,
    catalogue_id: Types.ObjectId
    region_id: Types.ObjectId
}

type SiteModal = Model<ISite>;
const siteSchema = new Schema<ISite,SiteModal>({
    name:{type:String, required:true},
    description:{type:String, required:false},
    location:{type:String, required:false,default:"Unspecified"},
    catalogue_id:{type: Schema.Types.ObjectId, ref:"Catalogue",required:true},
    region_id:{type: Schema.Types.ObjectId, ref:"Region",required:false}

},{timestamps:true});

// Triggers
/**  Cascade delete related artifacts */
siteSchema.pre("findOneAndDelete", async function(next) {
    await cascade_related<ISite, IProjectilePoint>(this.model, this.getFilter(), ProjectilePoint, "site_id");
    next();
});

/**
 * Handles the case where "no region" is selected from the UI
 * @summary Because not passing a field to mongo's update just doesn't modify it, and passing an empty string
 * causes an exception, we need to intercept site updates, check if they have set region_id = "", then take the
 * proper actions to unset it... An ordeal yes, but this is the way.
 */
siteSchema.pre("findOneAndUpdate",async function(next) {

    let mut_update:any = this.getUpdate() as any; // Get a mutable version of the update we are receiving

    if(mut_update.region_id === ""){
        delete mut_update.region_id; // remove region_id from the object original
        mut_update.$unset = {region_id:1} // and add the flag to unset it before proceeding with the update
        this.updateOne(this.getFilter(),mut_update)
    }

    next();
});


const Site:SiteModal = model<ISite,SiteModal>('Site',siteSchema);

export default Site;
