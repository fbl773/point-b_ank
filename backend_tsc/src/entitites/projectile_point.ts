import {Schema,Types,Model,model} from "mongoose"
import {IArtifact} from "./mongo_entity";

export interface IProjectilePoint extends IArtifact{
    name: string,
    description: string,
    blade_shape:string,
    hafting_shape:string,
    base_shape:string,
    cross_section:string,
}

type ProjectilePointModal = Model<IProjectilePoint>;
const projectilePointSchema = new Schema<IProjectilePoint,ProjectilePointModal>({
    name:{type:String, required:true},
    image:{type:String, required:false},
    description:{type:String, required:false},
    culture:{type:Types.ObjectId,ref:"Culture", required:false},
    material:{type:Types.ObjectId,ref:"Material",required:false},
    site_id:{type:Types.ObjectId,ref:"Site",required:true},
    //These could be set by "culture" templates OR hard-coded... maybe a good use of sub document here?
    blade_shape:{type:String,required:false,enum:["TODO","TODO1"]},
    base_shape:{type:String,required:false,enum:["TODO","TODO1"]},//TODO: Design decision about indeterminate handling. Backend or front?
    hafting_shape:{type:String,required:false,enum:["TODO","TODO1"]},
    cross_section:{type:String,required:false,enum:["TODO","TODO1"]}

},{timestamps:true});

/**
 * Cascade delete related artifacts
 */
// projectile_pointSchema.pre("findOneAndDelete", async function(next){
//     let self = await this.model.findOne(this.getFilter());
//     await Artifact.deleteMany({projectile_point_id:self._id});
//     next();
// })

const ProjectilePoint:ProjectilePointModal = model<IProjectilePoint,ProjectilePointModal>('ProjectilePoint',projectilePointSchema);

export default ProjectilePoint;
