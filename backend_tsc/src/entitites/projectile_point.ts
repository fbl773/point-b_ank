import {Schema,Types,Model,model} from "mongoose"
import {IArtifact} from "./mongo_entity";
import Culture from "./culture";
import Material from "./material";
import Site from "./site";

export interface IProjectilePoint extends IArtifact{
    name: string,
    description: string,
    blade_shape:string,
    hafting_shape:string,
    base_shape:string,
    cross_section:string,
}

type ProjectilePointModal = Model<IProjectilePoint>;
const projectile_pointSchema = new Schema<IProjectilePoint,ProjectilePointModal>({
    name:{type:String, required:true},
    image:{type:String, required:false},
    description:{type:String, required:false},
    culture:{type:Schema.Types.ObjectId,ref:"Culture",required:false},
    material:{type:Schema.Types.ObjectId,ref:"Material",required:false},
    site_id:{type:Schema.Types.ObjectId,ref:"Site",required:true},
    //These could be set by "culture" templates OR hard-coded... maybe a good use of sub document here?
    blade_shape:{type:String,required:false,enum:["triangular","excurvate","incurvate","ovate"]},
    base_shape:{type:String,required:false,enum:["straight","concave","convex"]},//TODO: Design decision about indeterminate handling. Backend or front? Tables?
    hafting_shape:{type:String,required:false,enum:["lanceolate","stemmed","basally concave","expanding","contracting","corner-notched","side-notched","basal-notched","triangular un-notched"]},
    cross_section:{type:String,required:false,enum:["rhomboid","lenticular","plano-convex","fluted","median-ridged","flat"]}

},{timestamps:true});

/**
 * Cascade delete related artifacts
 */
// projectile_pointSchema.pre("findOneAndDelete", async function(next){
//     let self = await this.model.findOne(this.getFilter());
//     await Artifact.deleteMany({projectile_point_id:self._id});
//     next();
// })

const ProjectilePoint:ProjectilePointModal = model<IProjectilePoint,ProjectilePointModal>('ProjectilePoint',projectile_pointSchema);

export default ProjectilePoint;
