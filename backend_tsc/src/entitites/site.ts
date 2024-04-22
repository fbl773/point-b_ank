import {Schema,Types,Model,model} from "mongoose"

export interface ISite{
    _id:Types.ObjectId,
    name: string,
    description: string,
    catalogue_id: Types.ObjectId
}

type SiteModal = Model<ISite>;
const siteSchema = new Schema<ISite,SiteModal>({
    name:{type:String, required:true},
    description:{type:String, required:false},
    catalogue_id:{type: Schema.Types.ObjectId, ref:"Catalogue"}

});

const Site:SiteModal = model<ISite,SiteModal>('Site',siteSchema);

export default Site;
