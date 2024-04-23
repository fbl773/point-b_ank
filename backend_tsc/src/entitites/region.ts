import {Schema,Types,Model,model} from "mongoose"
import {IMongo_Entity} from "./mongo_entity";

export interface IRegion extends IMongo_Entity{
    name: string,
    description: string,
    catalogue_id: Types.ObjectId
}

type RegionModal = Model<IRegion>;
const regionSchema = new Schema<IRegion,RegionModal>({
    name:{type:String, required:true},
    description:{type:String, required:false},
},{timestamps:true});

const Region:RegionModal = model<IRegion,RegionModal>('Region',regionSchema);

export default Region;
