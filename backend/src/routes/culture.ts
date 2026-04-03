import {Router} from "express";
import Culture, {ICulture} from "../entitites/culture";
import authenticate from "../utilities/jwt_utils";
import crud_factory from "../utilities/crud_factory";
import ProjectilePoint, {IProjectilePoint} from "../entitites/projectile_point";

const culture_router= Router();

/* Give them the CRUD treatment*/
crud_factory.create<ICulture>(Culture,culture_router,authenticate,"culture");
crud_factory.read_all<ICulture>(Culture,culture_router,authenticate,"culture");
crud_factory.read_one<ICulture>(Culture,culture_router,authenticate,"culture");
crud_factory.update_one<ICulture>(Culture,culture_router,authenticate,"culture");
crud_factory.delete_one<ICulture>(Culture,culture_router,authenticate,"culture");

//Specialty Endpoints

crud_factory.find_related<IProjectilePoint>("/:id/points",ProjectilePoint,culture_router,
    "culture_id", authenticate,"culture");

export default culture_router;