import {NextFunction, Request, Response, Router} from "express";
import Catalogue, {ICatalogue} from "../entitites/catalogue";
import authenticate from "../utilities/jwt_utils";
import crud_factory from "../utilities/crud_factory";
import Site, {ISite} from "../entitites/site";

const catalogue_router = Router();

/* Give them the CRUD treatment*/
crud_factory.create<ICatalogue>(Catalogue,catalogue_router,authenticate,"catalogue") //Handles POST /catalogue
crud_factory.read_all<ICatalogue>(Catalogue,catalogue_router,authenticate,"catalogue") // handles GET /catalogue
crud_factory.read_one<ICatalogue>(Catalogue,catalogue_router,authenticate,"catalogue") // handles GET /catalogue/:id
crud_factory.update_one<ICatalogue>(Catalogue,catalogue_router,authenticate,"catalogue") // handles PUT /catalogue/:id
crud_factory.delete_one<ICatalogue>(Catalogue,catalogue_router,authenticate,"catalogue") // handles DELETE /catalogue/:id

//Specialty endpoints
crud_factory.find_where<ISite>("/:id/sites",Site,catalogue_router,"catalogue_id",authenticate,"catalogue");

/*
catalogue_router.get("/:id/sites",
    authenticate,
    (req:Request,res:Response,_next:NextFunction) => {console.log("TODO:Validation RULES"); _next();}, //This seems silly actually their use could be handled on client side
    (_req:Request,_res:Response,_next:Function) => {console.log("TODO: VALIDATE"); _next()},
    (req: Request, res: Response) => {
        console.log("HERE");
        //adjust the filter to have the query param
        Site.find({catalogue_id:req.params.id})
            .then((entities) => res.status(201).send(entities))
            .catch(err => res.status(404).send({message:`Failed to find sites for catalogue ${req.params.id}`,err}))
    }

);
 */
export default catalogue_router;
