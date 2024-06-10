import {Schema, Model, model, Types} from "mongoose"
import {IMongo_Entity} from "./mongo_entity";
import ProjectilePoint, {IProjectilePoint} from "./projectile_point";
import {update_related} from "../utilities/trigger_factory";

export interface ICulture extends IMongo_Entity{
    name: string,
    period_id:Types.ObjectId,
    start: number,
    end: number
}

type CultureModel = Model<ICulture>;
const cultureSchema = new Schema<ICulture,CultureModel>({
    name:{type:String, required:true},
    period_id:{type:Schema.Types.ObjectId,ref:"Period",required:true},
    start:{type:Number,required:true,min:0},
    end:{type:Number,required:true,min:0},
});

//Triggers
/**
 * Cascade delete related cultures
 * On delete, update points to reflect unknown culture
 */
cultureSchema.pre("findOneAndDelete", async function(next){
    await update_related<ICulture, IProjectilePoint>(this.model, this.getFilter(),
        ProjectilePoint, "culture_id",{$unset:{culture_id: 1}});
    next();
})

const Culture:CultureModel = model<ICulture,CultureModel>('Culture',cultureSchema);

export default Culture;
