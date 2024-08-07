import {Schema,Model,model} from "mongoose"
import {IArtifact} from "./mongo_entity";

export interface IProjectilePoint extends IArtifact{
    ///Basics
    name: string,
    description: string,
    //Shape Attributes
    blade_shape:string,
    hafting_shape:string,
    base_shape:string,
    cross_section:string,
}

type ProjectilePointModal = Model<IProjectilePoint>;

//Accepted Values
const blade_shapes = ["triangular","excurvate","incurvate","ovate","indeterminate"];
const base_shapes = ["straight","concave","convex","indeterminate"];
const hafting_shapes =["lanceolate","stemmed","basally concave","expanding","contracting",
            "corner-notched","side-notched","basal-notched","triangular un-notched","indeterminate"] ;
const cross_section = ["rhomboid","lenticular","plano-convex","fluted","median-ridged","flat","indeterminate"];


const projectile_pointSchema = new Schema<IProjectilePoint,ProjectilePointModal>({
    //Basics
    name:{type:String, required:true},
    image:{type:String, required:false},
    description:{type:String, required:false},
    //Relations
    culture_id:{type:Schema.Types.ObjectId,ref:"Culture",required:false},
    period_id:{type:Schema.Types.ObjectId,ref:"Period",required:false},
    material_id:{type:Schema.Types.ObjectId,ref:"Material",required:false},
    site_id:{type:Schema.Types.ObjectId,ref:"Site",required:true},
    //Attributes
    blade_shape:{type:String,required:false,enum:blade_shapes,default:"indeterminate"},
    base_shape:{type:String,required:false,enum:base_shapes,default:"indeterminate"},//TODO: Design decision about indeterminate handling. Backend or front? Tables?
    hafting_shape:{type:String,required:false,enum:hafting_shapes,default:"indeterminate"},
    cross_section:{type:String,required:false,enum:cross_section,default:"indeterminate"},
    location:{type:String,required:false},
    dimensions:{type:[Number],required:false},


});

const ProjectilePoint:ProjectilePointModal = model<IProjectilePoint,ProjectilePointModal>('ProjectilePoint',projectile_pointSchema);

export default ProjectilePoint;
