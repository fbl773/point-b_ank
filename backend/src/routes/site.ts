import {Request, Response, NextFunction, Router, RequestHandler} from "express";
import Site, {ISite} from "../entitites/site";
import authenticate from "../utilities/jwt_utils";
import crud_factory from "../utilities/crud_factory";
import ProjectilePoint, {IProjectilePoint} from "../entitites/projectile_point";
import file_utils from "../utilities/file_utils";
import multer from "multer";


/* Helpers*/
/**
 *
 * @param req - the request to pull details from
 * @param res - vestigial
 * @param next
 */
function upload_point(req:Request, res:Response):RequestHandler<any>{
    console.log("We tried to uplaod a point...")
    let site_id = req.params.site_id;
    let point_id = req.params.point_id;
    let file_dest = `uploads/${site_id}/${point_id}`;
    let uploader:multer.Multer = multer({dest:file_dest})
    return uploader.single("body");
}

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

file_utils.upload_one(site_router,authenticate,upload_point,"/:site_id/upload/:point_id","site/point");

export default site_router;