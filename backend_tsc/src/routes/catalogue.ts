import {Router} from "express";
import Catalogue, {ICatalogue} from "../entitites/catalogue";
import authenticate from "../utilities/jwt_utils";
import crud_factory from "../utilities/crud_factory";
import Site, {ISite} from "../entitites/site";

const catalogue_router = Router();

/* Give them the CRUD treatment*/
crud_factory.create<ICatalogue>(Catalogue,catalogue_router,authenticate,"catalogue")
crud_factory.read_all<ICatalogue>(Catalogue,catalogue_router,authenticate,"catalogue")
crud_factory.read_one<ICatalogue>(Catalogue,catalogue_router,authenticate,"catalogue")
crud_factory.update_one<ICatalogue>(Catalogue,catalogue_router,authenticate,"catalogue")
crud_factory.delete_one<ICatalogue>(Catalogue,catalogue_router,authenticate,"catalogue")

//Specialty endpoints
crud_factory.find_related<ISite>("/:id/sites",Site,catalogue_router,
    "catalogue_id",authenticate,"catalogue");

export default catalogue_router;
