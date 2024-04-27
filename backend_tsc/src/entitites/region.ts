import {Schema,Model,model} from "mongoose"
import {IMongo_Entity} from "./mongo_entity";
import {update_related} from "../utilities/trigger_factory";
import Site, {ISite} from "./site";

export interface IRegion extends IMongo_Entity{
    name: string,
    description: string,
}

type RegionModal = Model<IRegion>;
const regionSchema = new Schema<IRegion,RegionModal>({
    name:{type:String, required:true},
    description:{type:String, required:false},
},{timestamps:true});

const Region:RegionModal = model<IRegion,RegionModal>('Region',regionSchema);

//Triggers
regionSchema.pre("findOneAndDelete", async function(next) {
    await update_related<IRegion, ISite>(this.model, this.getFilter(),
        Site, "region_id",{region_id:""});
    next();
})


export default Region;
