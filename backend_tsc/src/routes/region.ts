import {Router} from "express";
import Region, {IRegion} from "../entitites/region";
import authenticate from "../utilities/jwt_utils";
import crud_factory from "../utilities/crud_factory";

const region_router= Router();

/* Give them the CRUD treatment*/
crud_factory.create<IRegion>(Region,region_router,authenticate,"region") //Handles POST /region
crud_factory.read_all<IRegion>(Region,region_router,authenticate,"region") // handles GET /region
crud_factory.read_one<IRegion>(Region,region_router,authenticate,"region") // handles GET /region/:id
crud_factory.update_one<IRegion>(Region,region_router,authenticate,"region") // handles PUT /region/:id
crud_factory.delete_one<IRegion>(Region,region_router,authenticate,"region") // handles DELETE /region/:id

export default region_router;