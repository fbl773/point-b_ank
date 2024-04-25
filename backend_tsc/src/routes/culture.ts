import {Router} from "express";
import Culture, {ICulture} from "../entitites/culture";
import authenticate from "../utilities/jwt_utils";
import crud_factory from "../utilities/crud_factory";

const culture_router= Router();

/* Give them the CRUD treatment*/
crud_factory.create<ICulture>(Culture,culture_router,authenticate,"culture") //Handles POST /culture
crud_factory.read_all<ICulture>(Culture,culture_router,authenticate,"culture") // handles GET /culture
crud_factory.read_one<ICulture>(Culture,culture_router,authenticate,"culture") // handles GET /culture/:id
crud_factory.update_one<ICulture>(Culture,culture_router,authenticate,"culture") // handles PUT /culture/:id
crud_factory.delete_one<ICulture>(Culture,culture_router,authenticate,"culture") // handles DELETE /culture/:id

export default culture_router;