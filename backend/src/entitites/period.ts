import {Schema,Model,model} from "mongoose"
import {IMongo_Entity} from "./mongo_entity";
import Culture, {ICulture} from "./culture";
import {cascade_related} from "../utilities/trigger_factory";

//Schema
export interface IPeriod extends IMongo_Entity{
    name: string,
    start: number,
    end: number
}

type PeriodModel = Model<IPeriod>;
const periodSchema = new Schema<IPeriod,PeriodModel>({
    name:{type:String, required:true},
    start:{type:Number,required:true,min:0},
    end:{type:Number,required:true,min:0}

});
const Period:PeriodModel = model<IPeriod,PeriodModel>('Period',periodSchema);


//Triggers

/* Cascade delete related cultures */
periodSchema.pre("findOneAndDelete", async function(next){
    await cascade_related<IPeriod,ICulture>(this.model,this.getFilter(),Culture,"period_id");
    next();
})



export default Period;
