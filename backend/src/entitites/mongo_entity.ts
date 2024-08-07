import Types from "mongoose"
export interface IMongo_Entity{
    _id:Types.ObjectId
}

export interface IHas_Image extends IMongo_Entity{
    image:string
}

export interface IArtifact extends IHas_Image{
    //Relations
    site_id:Types.ObjectId,
    material_id:Types.ObjectId,
    culture_id:Types.ObjectId,
    period_id:Types.ObjectId,
    //Attributes
    dimensions:[number],
    location:string
}