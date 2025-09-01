import {Router} from "express";
import Site, {ISite} from "../entitites/site";
import authenticate from "../utilities/jwt_utils";
import crud_factory from "../utilities/crud_factory";
import ProjectilePoint, {IProjectilePoint} from "../entitites/projectile_point";
import file_utils from "../utilities/file_utils";
import {MulterFactory} from "../utilities/multer_factory";

const site_multer = new MulterFactory("sites", "site_id", "point_id", "file")

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


file_utils.delete_one(site_router,authenticate,"/:site_id/upload/:point_id","sites","site_id","point_id");
file_utils.upload_one(site_router,authenticate,site_multer.create_single(),"/:site_id/upload/:point_id","site-point");
file_utils.get_img(site_router,authenticate,"/:site_id/:point_id","sites","site_id","point_id")

export default site_router;