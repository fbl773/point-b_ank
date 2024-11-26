import {Request, Response, NextFunction, Router, RequestHandler} from "express";
import Site, {ISite} from "../entitites/site";
import authenticate from "../utilities/jwt_utils";
import crud_factory from "../utilities/crud_factory";
import ProjectilePoint, {IProjectilePoint} from "../entitites/projectile_point";
import file_utils from "../utilities/file_utils";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        let dirname = `./uploads/sites/${req.params.site_id}`
        cb(null,dirname)
    },
    filename: (req,file,cb) => {
        let filename = `${req.params.point_id}${path.extname(file.originalname)}`
        cb(null,filename);
    }
})

const upload_site_img = multer({
    storage: storage,
}).single("file");

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


file_utils.upload_one(site_router,authenticate,upload_site_img,"/:site_id/upload/:point_id","site/point");

export default site_router;