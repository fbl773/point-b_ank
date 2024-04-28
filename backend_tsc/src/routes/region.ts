import {Router} from "express";
import Region, {IRegion} from "../entitites/region";
import authenticate from "../utilities/jwt_utils";
import crud_factory from "../utilities/crud_factory";

const region_router= Router();

/* Give them the CRUD treatment*/
crud_factory.create<IRegion>(Region,region_router,authenticate,"region");
crud_factory.read_all<IRegion>(Region,region_router,authenticate,"region");
crud_factory.read_one<IRegion>(Region,region_router,authenticate,"region");
crud_factory.update_one<IRegion>(Region,region_router,authenticate,"region");
crud_factory.delete_one<IRegion>(Region,region_router,authenticate,"region");

export default region_router;