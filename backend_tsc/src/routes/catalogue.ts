import {NextFunction, Request, Response, Router} from "express";
import Catalogue, {ICatalogue} from "../entitites/catalogue";
import authenticate, {get_payload, TokenData} from "../utilities/jwt_utils";

const catalogue_router = Router();

/**
 * Handles the request to create a new catalogue, assigning it an ID on success.
 * @param new_cat:ICatalogue - the new catalogue to update with
 * @param res:Response - response handle
 */
async function new_catalogue(new_cat:ICatalogue,res:Response){
    return await Catalogue.create(new_cat)
        .then((nc) => res.status(201).send({id:nc._id}))
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
 * @param res
 */
async function get_catalogue(id:string,res:Response){
    return Catalogue.findById(id)
        .then(cat => res.status(200).send(cat))
}

/**
 * Updates the document with the given ID
 * @param id:string - The ID of the point to update
 * @param new_cat:ICatalogue - the body to update the document with
 * @param res:Response - response handle
 */
async function update_catalogue(id: string, new_cat: ICatalogue, res:Response){
    return Catalogue.findOneAndUpdate({_id:id},new_cat,{new:true})
        .then((updated) => res.status(200).send({
            message:`Successfully updated ${id}`,
            updated
        }))
}

async function delete_catalogue(id:string,res:Response){
    return Catalogue.findOneAndDelete({_id:id},{})
        .then((dc) => {
            if(dc)
                res.status(200).send({message:`Successfully deleted catalogue ${id}`})
            else
                res.status(404).send({message:`No such catalogue`})
        })
}

/** Routes */

catalogue_router.post("/",
    authenticate,
    (req:Request,res:Response,_next:NextFunction) => {console.log("TODO:Validation RULES"); _next();}, //This seems silly actually their use could be handled on client side
    (_req:Request,_res:Response,_next:Function) => {console.log("TODO: VALIDATE"); _next()},
    (req:Request,res:Response) => new_catalogue(req.body,res)
        .catch(_err => res.status(500).send({message:`failed to create new catalogue with data`, data:req.body}))
);

catalogue_router.get("/",
    authenticate,
    (req:Request,res:Response,_next:NextFunction) => {console.log("TODO:Validation RULES"); _next();}, //This seems silly actually their use could be handled on client side
    (_req:Request,_res:Response,_next:Function) => {console.log("TODO: VALIDATE"); _next()},
    (req:Request,res:Response) => get_catalogues()
        .then((catalogues) =>{
            res.status(200).send(catalogues)
        })
        .catch(err => res.status(404).send({message:`Failed to find catalogues`,err}))
);

catalogue_router.get("/:id",
    authenticate,
    (req:Request,res:Response,_next:NextFunction) => {console.log("TODO:Validation RULES"); _next();}, //This seems silly actually their use could be handled on client side
    (_req:Request,_res:Response,_next:Function) => {console.log("TODO: VALIDATE"); _next()},
    (req:Request,res:Response) => {
        get_catalogue(req.params.id,res)
            .catch(err => res.status(404).send({message:`Failed to find catalogue ${req.params.id}`,err}))
    }
);


catalogue_router.put("/:id",
    authenticate,
    (req:Request,res:Response,_next:NextFunction) => {console.log("TODO:Validation RULES"); _next();}, //This seems silly actually their use could be handled on client side
    (_req:Request,_res:Response,_next:Function) => {console.log("TODO: VALIDATE"); _next()},
    (req:Request,res:Response) => {
        update_catalogue(req.params.id, req.body,res)
            .catch((err) => res.status(406).send({message:`failed to update Catalogue ${req.params.id}`,err}))
    }
);

catalogue_router.delete("/:id",
    authenticate,
    (req:Request,res:Response,_next:NextFunction) => {console.log("TODO:Validation RULES"); _next();}, //This seems silly actually their use could be handled on client side
    (_req:Request,_res:Response,_next:Function) => {console.log("TODO: VALIDATE"); _next()},
    (req:Request,res:Response) => {
        delete_catalogue(req.params.id,res)
            .catch((err) => {res.status(500).send({message:`failed to delete catalogue ${req.params.id}`,err})})
    }
);

export default catalogue_router



