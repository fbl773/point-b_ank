import {Router} from "express";
import Site, {ISite} from "../entitites/site";
import authenticate from "../utilities/jwt_utils";
import crud_factory from "../utilities/crud_factory";

const site_router= Router();

/* Give them the CRUD treatment*/
crud_factory.create<ISite>(Site,site_router,authenticate,"site") //Handles POST /sites
crud_factory.read_all<ISite>(Site,site_router,authenticate,"site") // handles GET /sites
crud_factory.read_one<ISite>(Site,site_router,authenticate,"site") // handles GET /site/:id
crud_factory.update_one<ISite>(Site,site_router,authenticate,"site") // handles PUT /site/:id
crud_factory.delete_one<ISite>(Site,site_router,authenticate,"site") // handles DELETE /site/:id

export default site_router;