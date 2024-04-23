import {Router} from "express";
import Catalogue, {ICatalogue} from "../entitites/catalogue";
import authenticate from "../utilities/jwt_utils";
import crud_factory from "../utilities/crud_factory";

const catalogue_router = Router();

/* Give them the CRUD treatment*/
crud_factory.create<ICatalogue>(Catalogue,catalogue_router,authenticate,"catalogue") //Handles POST /catalogue
crud_factory.read_all<ICatalogue>(Catalogue,catalogue_router,authenticate,"catalogue") // handles GET /catalogue
crud_factory.read_one<ICatalogue>(Catalogue,catalogue_router,authenticate,"catalogue") // handles GET /catalogue/:id
crud_factory.update_one<ICatalogue>(Catalogue,catalogue_router,authenticate,"catalogue") // handles PUT /catalogue/:id
crud_factory.delete_one<ICatalogue>(Catalogue,catalogue_router,authenticate,"catalogue") // handles DELETE /catalogue/:id

export default catalogue_router;
