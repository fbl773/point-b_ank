import {NextFunction, Request, Response, Router} from "express";
import ProjectilePoint, {IProjectilePoint} from "../entitites/projectile_point";
import authenticate from "../utilities/jwt_utils";
import crud_factory from "../utilities/crud_factory";
import {Model} from "mongoose";
import site_router from "./site";
import Projectile_point from "../entitites/projectile_point";

const projectile_point_router= Router();

/* Give them the CRUD treatment*/
crud_factory.create<IProjectilePoint>(ProjectilePoint,projectile_point_router,authenticate,"projectile_point") //Handles POST /projectile_points
crud_factory.read_all<IProjectilePoint>(ProjectilePoint,projectile_point_router,authenticate,"projectile_point") // handles GET /projectile_points
crud_factory.read_one<IProjectilePoint>(ProjectilePoint,projectile_point_router,authenticate,"projectile_point") // handles GET /projectile_point/:id
crud_factory.update_one<IProjectilePoint>(ProjectilePoint,projectile_point_router,authenticate,"projectile_point") // handles PUT /projectile_point/:id
crud_factory.delete_one<IProjectilePoint>(ProjectilePoint,projectile_point_router,authenticate,"projectile_point") // handles DELETE /projectile_point/:id

//TODO: Special routes to get point specifics (i.e. culture,material,etc)

export default projectile_point_router;