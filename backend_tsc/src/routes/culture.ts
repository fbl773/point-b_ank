import {Router} from "express";
import Culture, {ICulture} from "../entitites/culture";
import authenticate from "../utilities/jwt_utils";
import crud_factory from "../utilities/crud_factory";

const culture_router= Router();

/* Give them the CRUD treatment*/
crud_factory.create<ICulture>(Culture,culture_router,authenticate,"culture");
crud_factory.read_all<ICulture>(Culture,culture_router,authenticate,"culture");
crud_factory.read_one<ICulture>(Culture,culture_router,authenticate,"culture");
crud_factory.update_one<ICulture>(Culture,culture_router,authenticate,"culture");
crud_factory.delete_one<ICulture>(Culture,culture_router,authenticate,"culture");

export default culture_router;