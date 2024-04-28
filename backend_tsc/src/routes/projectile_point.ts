import {Router} from "express";
import ProjectilePoint, {IProjectilePoint} from "../entitites/projectile_point";
import authenticate from "../utilities/jwt_utils";
import crud_factory from "../utilities/crud_factory";

const projectile_point_router= Router();

/* Give them the CRUD treatment*/
crud_factory.create<IProjectilePoint>(ProjectilePoint,projectile_point_router,authenticate,"projectile_point");
crud_factory.read_all<IProjectilePoint>(ProjectilePoint,projectile_point_router,authenticate,"projectile_point");
crud_factory.read_one<IProjectilePoint>(ProjectilePoint,projectile_point_router,authenticate,"projectile_point");
crud_factory.update_one<IProjectilePoint>(ProjectilePoint,projectile_point_router,authenticate,"projectile_point");
crud_factory.delete_one<IProjectilePoint>(ProjectilePoint,projectile_point_router,authenticate,"projectile_point");

//TODO: Special routes to get point specifics (i.e. culture,material,etc)

export default projectile_point_router;