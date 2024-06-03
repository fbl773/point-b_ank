import {Router} from "express";
import Site, {ISite} from "../entitites/site";
import authenticate from "../utilities/jwt_utils";
import crud_factory from "../utilities/crud_factory";
import ProjectilePoint, {IProjectilePoint} from "../entitites/projectile_point";

const site_router= Router();

/* Give them the CRUD treatment*/
crud_factory.create<ISite>(Site,site_router,authenticate,"site");
crud_factory.read_all<ISite>(Site,site_router,authenticate,"site");
crud_factory.read_one<ISite>(Site,site_router,authenticate,"site") ;
crud_factory.update_one<ISite>(Site,site_router,authenticate,"site");
crud_factory.delete_one<ISite>(Site,site_router,authenticate,"site");

//Specialty endpoints



crud_factory.find_related<IProjectilePoint>("/:id/points",ProjectilePoint,site_router,
    "site_id",authenticate,"site");


export default site_router;