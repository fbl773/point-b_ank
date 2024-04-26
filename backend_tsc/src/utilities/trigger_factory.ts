import {Model, Schema,FilterQuery} from "mongoose";
import {IMongo_Entity} from "../entitites/mongo_entity";
import {NextFunction} from "express";

function build_filter(parent_field_value:string,field_name:string):any{
    let filter:any = {};
    filter[field_name] = parent_field_value;
    return filter;
}
export async function cascade_related<T extends IMongo_Entity,
    G extends IMongo_Entity>(src_model:Model<T>, find_filter: FilterQuery<T>, target_model:Model<G>, target_field: string){

    let self:any= await src_model.findOne(find_filter);
    let delete_filter = build_filter(self._id,target_field);
    await target_model.deleteMany(delete_filter)
        .catch(err => {console.error(`Failed to delete ${target_field}s for ${self._id}`)});
}

export async function update_related<T extends IMongo_Entity>(my_id:string,target_model:Model<T>,target_field:string, update:T){
    let filter = build_filter(my_id,target_field);
    return target_model.updateMany(filter,(update as any))
}