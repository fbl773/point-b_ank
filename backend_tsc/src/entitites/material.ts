import {Schema,Model,model} from "mongoose"
import {IHas_Image} from "./mongo_entity";

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

/**
 * Cascade delete related artifacts
 */
// materialSchema.pre("findOneAndDelete", async function(next){
//     let self = await this.model.findOne(this.getFilter());
//     await Artifact.deleteMany({material_id:self._id});
//     next();
// })

const Material:MaterialModal = model<IMaterial,MaterialModal>('Material',materialSchema);

export default Material;
