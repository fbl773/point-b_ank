import {Schema,Types,Model,model} from "mongoose"

export interface IPeriod {
    _id:Types.ObjectId,
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

export default Period;
