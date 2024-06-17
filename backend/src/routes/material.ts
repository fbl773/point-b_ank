import {Router} from "express";
import Material, {IMaterial} from "../entitites/material";
import authenticate from "../utilities/jwt_utils";
import crud_factory from "../utilities/crud_factory";
import ProjectilePoint, {IProjectilePoint} from "../entitites/projectile_point";

const material_router= Router();

/* Give them the CRUD treatment*/
crud_factory.create<IMaterial>(Material,material_router,authenticate,"material");
crud_factory.read_all<IMaterial>(Material,material_router,authenticate,"material");
crud_factory.read_one<IMaterial>(Material,material_router,authenticate,"material");
crud_factory.update_one<IMaterial>(Material,material_router,authenticate,"material");
crud_factory.delete_one<IMaterial>(Material,material_router,authenticate,"material");


// Specialty Endpoints

crud_factory.find_related<IProjectilePoint>("/:id/points",ProjectilePoint,material_router,
    "material_id", authenticate,"material");

export default material_router;