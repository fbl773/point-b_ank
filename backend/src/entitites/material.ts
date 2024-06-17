import {Schema,Model,model} from "mongoose"
import {IHas_Image} from "./mongo_entity";
import ProjectilePoint, {IProjectilePoint} from "./projectile_point";
import {update_related} from "../utilities/trigger_factory";

export interface IMaterial extends IHas_Image{
    name: string,
    description: string,
    artifact_type:string
}

type MaterialModal = Model<IMaterial>;
const materialSchema = new Schema<IMaterial,MaterialModal>({
    name:{type:String, required:true},
    image:{type:String, required:false},
    description:{type:String, required:false},
    artifact_type:{type:String,required:true,enum:["lithic","faunal","ceramic","other"]}

},{timestamps:true});


//Triggers

/* Cascade update points of this material */
 materialSchema.pre("findOneAndDelete", async function(next){
     await update_related<IMaterial, IProjectilePoint>(this.model, this.getFilter(),
         ProjectilePoint, "material_id",{$unset:{material_id:1}});
     next();
 })

const Material:MaterialModal = model<IMaterial,MaterialModal>('Material',materialSchema);

export default Material;
