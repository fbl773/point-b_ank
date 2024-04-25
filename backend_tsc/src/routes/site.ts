import {NextFunction, Request, Response, Router} from "express";
import Site, {ISite} from "../entitites/site";
import authenticate from "../utilities/jwt_utils";
import crud_factory from "../utilities/crud_factory";
import ProjectilePoint, {IProjectilePoint} from "../entitites/projectile_point";

const site_router= Router();

/* Give them the CRUD treatment*/
crud_factory.create<ISite>(Site,site_router,authenticate,"site") //Handles POST /sites
crud_factory.read_all<ISite>(Site,site_router,authenticate,"site") // handles GET /sites
crud_factory.read_one<ISite>(Site,site_router,authenticate,"site") // handles GET /site/:id
crud_factory.update_one<ISite>(Site,site_router,authenticate,"site") // handles PUT /site/:id
crud_factory.delete_one<ISite>(Site,site_router,authenticate,"site") // handles DELETE /site/:id


//Specialty endpoints
site_router.get(":id/points",
    authenticate,
    (req:Request,res:Response,_next:NextFunction) => {console.log("TODO:Validation RULES"); _next();}, //This seems silly actually their use could be handled on client side
    (_req:Request,_res:Response,_next:Function) => {console.log("TODO: VALIDATE"); _next()},
    (req: Request, res: Response) => {
        //adjust the filter to have the query param
        ProjectilePoint.find({site_id:req.params.id})
            .then((entities) => res.status(201).send(entities))
            .catch(err => res.status(404).send({message:`Failed to find points for sight ${req.params.id}`,err}))
    }
);

export default site_router;