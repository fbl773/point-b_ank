import {Schema,model,Model} from "mongoose"

export interface ICatalogue{
   name: string,
   description: string
}

type CatalogueModel = Model<ICatalogue>;
const catalogueSchema = new Schema<ICatalogue,CatalogueModel>({
    name:{type:String, required:true},
    description:{type:String, required:false},
});

const Catalogue:CatalogueModel = model<ICatalogue,CatalogueModel>('Catalogue',catalogueSchema);

export default Catalogue;
