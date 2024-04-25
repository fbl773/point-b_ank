import {Schema, Model, model, Types} from "mongoose"
import {IMongo_Entity} from "./mongo_entity";
import Period from "./period";
import ProjectilePoint from "./projectile_point";

export interface ICulture extends IMongo_Entity{
    name: string,
    period_id:Types.ObjectId,
    start: number,
    end: number
    //templates:[],
}

type CultureModel = Model<ICulture>;
const cultureSchema = new Schema<ICulture,CultureModel>({
    name:{type:String, required:true},
    period_id:{type:Schema.Types.ObjectId,ref:Period,required:true},
    start:{type:Number,required:true,min:0},
    end:{type:Number,required:true,min:0},
    //templates:{type:[Types.ObjectId],required:false}

});

/**
 * Cascade delete related cultures
 */

/**
 * On delete, update points to reflect unknown culture
 * TODO: Or should we delete?
 */
cultureSchema.pre("findOneAndDelete", async function(next){
    let self = await this.model.findOne(this.getFilter());
    await ProjectilePoint.updateMany({culture_id:self._id},{culture_id:""});
    next();
})

const Culture:CultureModel = model<ICulture,CultureModel>('Culture',cultureSchema);

export default Culture;
