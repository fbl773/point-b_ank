import {NextFunction, Request, Response, Router} from "express";
import {Db_conn} from "../db_conn";
import Catalogue, {ICatalogue} from "../entitites/catalogue";
import authenticate, {get_payload, TokenData} from "../utilities/jwt_utils";

const _db_conn = Db_conn.init("mongodb://localhost:27017/pblank","Catalogue_Router")

const catalogue_router = Router();

/**
 * Handles the request to create a new catalogue, assigning it an ID on success.
 * @param req - the request containing the new catalogue details
 * @param req.body.name:string - the name of the new catalogue
 * @param req.body.description:string - the description of the new catalogue
 */
async function new_catalogue(req:Request){
    let new_cat:ICatalogue = req.body;
    return await Catalogue.create(new_cat)
}

/**
 * Gets all catalogues in the database
 * @override makes a query to the db to get all catalogues
 */
async function get_catalogues(){
    return Catalogue.find({})
}

/**
 * Fetches the catalogue with the given ID from the database
 * @param id:string - the object ID of the catalogue we want to find
 */
async function get_catalogue(id:string){
    console.log(`Looking for catalogue: ${id}`)
    return Catalogue.findById(id)
}

/** Routes */

catalogue_router.post("/",
    authenticate,
    (req:Request,res:Response,_next:NextFunction) => {console.log("TODO:Validation RULES"); _next();}, //This seems silly actually their use could be handled on client side
    (_req:Request,_res:Response,_next:Function) => {console.log("TODO: VALIDATE"); _next()},
    (req:Request,res:Response) => new_catalogue(req)
        .then((nc) => res.status(201).send({id:nc._id}))
        .catch((_err) => res.status(500))
);

catalogue_router.get("/",
    authenticate,
    (req:Request,res:Response,_next:NextFunction) => {console.log("TODO:Validation RULES"); _next();}, //This seems silly actually their use could be handled on client side
    (_req:Request,_res:Response,_next:Function) => {console.log("TODO: VALIDATE"); _next()},
    (req:Request,res:Response) => get_catalogues()
        .then((catalogues) =>{
            res.status(200).send(catalogues)
        })
        .catch((err) => {
            res.status(404).send({message:`Failed to find catalogues`,err})
        })
);

catalogue_router.get("/:id",
    authenticate,
    (req:Request,res:Response,_next:NextFunction) => {console.log("TODO:Validation RULES"); _next();}, //This seems silly actually their use could be handled on client side
    (_req:Request,_res:Response,_next:Function) => {console.log("TODO: VALIDATE"); _next()},
    (req:Request,res:Response) => {
        get_catalogue(req.params.id)
            .then((cat) => {
                res.status(200).send(cat)
            })
            .catch((err) => {
                res.status(404).send({message:`Failed to find catalogue ${req.params.id}`,err})
            })
    }
);


catalogue_router.put("/:id",
    authenticate,
    (req:Request,res:Response,_next:NextFunction) => {console.log("TODO:Validation RULES"); _next();}, //This seems silly actually their use could be handled on client side
    (_req:Request,_res:Response,_next:Function) => {console.log("TODO: VALIDATE"); _next()},
    (req:Request,res:Response) => res.status(501).send({message:"wat"})
);

export default catalogue_router



