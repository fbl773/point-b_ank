import Types from "mongoose"
export interface IMongo_Entity{
    _id:Types.ObjectId
}

export interface IHas_Image extends IMongo_Entity{
    image:string
}

// export interface IArtifact extends IHas_Image{
//     site_id:Types.ObjectId,
//     material:Types.ObjectId
//     image_path:string,
//     dimensions:[],
// }