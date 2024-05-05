import {Model, FilterQuery} from "mongoose";
import {IMongo_Entity} from "../entitites/mongo_entity";

/**
 * Builds a filter object for mongo queries/updates of the type {field_name:field_value}
 * @param field_name:string - the name of the field to assign a value
 * @param field_value:any- the value to assign...
 */
function build_filter(field_name:string,field_value:any):any{
    let filter:any = {};
    filter[field_name] = field_value;
    return filter;
}

/**
 * Builds a ON DELETE CASCADE between type <T> and <G>.
 * @overview on delete of T, find and deleted related G
 * @param src_model:Model<T> - the parent model instance being deleted from
 * @param find_filter:FilterQuery<T> - the query filter needed to get the specific T being deleted
 * @param target_model:Model<G> - the model to search for relations on
 * @param target_field:string - the field to search for the relation on
 */
export async function cascade_related<T extends IMongo_Entity,
    G extends IMongo_Entity>(src_model:Model<T>, find_filter: FilterQuery<T>, target_model:Model<G>, target_field: string){

    //Find the parent T object being acted on
    let self:any= await src_model.findOne(find_filter);

    //Build a filter to find instances of related G
    let delete_filter = build_filter(target_field,self._id);

    //Find and delete those Gs
    await target_model.deleteMany(delete_filter)
        .catch(err => {console.error(`Failed to delete ${target_field}s for ${self._id}`,err)});
}

/**
 * Builds a new ON DELETE UPDATE Between types T and G
 * @param src_model:Model<T> - the parent model instance being deleted from
 * @param find_filter:FilterQuery<T> - the query filter needed to get the specific T being deleted
 * @param target_model:Model<G> - the model to search for relations on
 * @param target_field:string - the field to search for the relation on
 * @param update:any - the object that should hold properties of G to update
 */
export async function update_related<T extends IMongo_Entity,
    G extends IMongo_Entity>(src_model:Model<T>, find_filter: FilterQuery<T>,
                             target_model:Model<G>, target_field: string, update:any){

    //Find the parent object being acted on
    let self:any= await src_model.findOne(find_filter);

    //Build a filter to G find where has matching id
    let update_filter = build_filter(target_field,self._id);

    //Find and update those Gs
    await target_model.updateMany(update_filter,update)
        .catch(err => {console.error(`Failed to update ${target_field}s for ${self._id}`,err)});
}
