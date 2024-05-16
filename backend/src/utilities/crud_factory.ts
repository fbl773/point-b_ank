import {Model} from "mongoose"
import {NextFunction, Request, Response, Router} from "express";
import {IMongo_Entity} from "../entitites/mongo_entity";

/**
 * Handles the C in CRUD via POST
 * @overview: Builds the handling for a POST request to create a new DB Entity into the passed router
 * @param model:IMongo_Entity - the DB Entity we will be creating
 * @param router:Router - the router we will add the edpoint to
 * @param authenticate:Function - the Authentication method we will be using
 * @param entity_name:string - OPTIONAL parameter to specify entity calling. Handy for error message context.
 */
function create<T extends IMongo_Entity>(model:Model<T>,
                         router:Router,
                         authenticate:(req:Request,res:Response,next:NextFunction)=>Promise<any>,
                         entity_name?:string){
    router.post("/",
        authenticate,
        (req:Request,res:Response,_next:NextFunction) => {console.log("TODO:Validation RULES"); _next();}, //This seems silly actually their use could be handled on client side
        (_req:Request,_res:Response,_next:Function) => {console.log("TODO: VALIDATE",entity_name); _next()},
        (req: Request, res: Response) => {
            let new_entity: T = req.body;
            model.create(new_entity)
                .then((nent:T) => res.status(201).send(
                    {
                        message:`Created new ${entity_name}`,
                        id:nent._id
                    }))
                .catch(err => res.status(404).send({message:`Failed to create ${entity_name}`,err}))
        }
    );
}

/**
 * Handles the R in CRUD via GET
 * @overview: Builds the handling for a GET request to the base URL, traditionally interpreted as "Get All"
 * @param model:IMongo_Entity - the Mongo Collection we will be accessing
 * @param router:Router - the router we will add the endpoint to
 * @param authenticate:Function - the Authentication method we will be using
 * @param entity_name:string - OPTIONAL parameter to specify entity calling. Handy for error message context.
 */
function read_all<T>(model:Model<T>,
                           router:Router,
                           authenticate:(req:Request,res:Response,next:NextFunction)=>Promise<any>,
                           entity_name?:string,
                     ){
    router.get("/",
        authenticate,
        (req:Request,res:Response,_next:NextFunction) => {console.log("TODO:Validation RULES"); _next();}, //This seems silly actually their use could be handled on client side
        (_req:Request,_res:Response,_next:Function) => {console.log("TODO: VALIDATE",entity_name); _next()},
        (req: Request, res: Response) => {
            model.find({})
                .then((entities) => res.status(200).send(entities))
                .catch(err => res.status(404).send({message:`Failed to find${entity_name}s`,err}))
        }
    );
}

/**
 * Handles the R in CRUD for a single DB Object
 * @overview: Builds the handling for a GET request on a single DB entity by ID
 * @param model:IMongo_Entity - the Mongo Collection we will be accessing
 * @param router:Router - the router we will add the endpoint to
 * @param authenticate:Function - the Authentication method we will be using
 * @param entity_name:string - OPTIONAL parameter to specify entity calling. Handy for error message context.
 */
function read_one<T>(model:Model<T>,
                           router:Router,
                           authenticate:(req:Request,res:Response,next:NextFunction)=>Promise<any>,
                           entity_name:string = "Unspecified Entity"){
    router.get("/:id",
        authenticate,
        (req:Request,res:Response,_next:NextFunction) => {console.log("TODO:Validation RULES"); _next();}, //This seems silly actually their use could be handled on client side
        (_req:Request,_res:Response,_next:Function) => {console.log("TODO: VALIDATE",entity_name); _next()},
        (req: Request, res: Response) => {
            model.findById(req.params.id ?? "NO ID")
                .then(cat => cat ? res.status(200).send(cat) :
                    res.status(404).send({message:`${entity_name} ${req.params.id} not found`}))
                .catch(err => res.status(404).send({message:`Failed to find ${entity_name} ${req.params.id}`,err}))
        }
    );
}


/**
 * Handles the U in CRUD for a single DB Object
 * @overview: Builds the handling for a PUT request on a single DB entity by ID to update it
 * @param model:IMongo_Entity - the Mongo Collection we will be accessing
 * @param router:Router - the router we will add the endpoint to
 * @param authenticate:Function - the Authentication method we will be using
 * @param entity_name:string - OPTIONAL parameter to specify entity calling. Handy for error message context.
 */
function update_one<T>(model:Model<T>,
                             router:Router,
                             authenticate:(req:Request,res:Response,next:NextFunction)=>Promise<any>,
                             entity_name?:string){
    //Give the router the create request for the entity
    router.put("/:id",
        authenticate,
        (req:Request,res:Response,_next:NextFunction) => {console.log("TODO:Validation RULES"); _next();}, //This seems silly actually their use could be handled on client side
        (_req:Request,_res:Response,_next:Function) => {console.log(`TODO: VALIDATE ${entity_name}`); _next()},
        (req: Request, res: Response) => {
            let new_ent = req.body;
            model.findOneAndUpdate({_id:req.params.id},new_ent,{new:true,runValidators:true})
                .then((updated) => updated ?
                    res.status(200).send( { message:`Successfully updated ${entity_name} ${req.params.id}`, updated}):
                    res.status(404).send({message:`Update Failed: ${entity_name} ${req.params.id} not found`})
                )
                .catch((err) => res.status(406).send({message:`failed to update ${entity_name} ${req.params.id}`,err:err.message}))
        }
    );
}

/**
 * Handles the D in CRUD for a single DB Object
 * @overview: Builds the handling for a DELETE request on a single DB entity by ID to delete it
 * @param model:IMongo_Entity - the Mongo Collection we will be accessing
 * @param router:Router - the router we will add the endpoint to
 * @param authenticate:Function - the Authentication method we will be using
 * @param entity_name:string - OPTIONAL parameter to specify entity calling. Handy for error message context.
 */
function delete_one<T>(model:Model<T>,
                             router:Router,
                             authenticate:(req:Request,res:Response,next:NextFunction)=>Promise<any>,
                             entity_name?:string){
    //Give the router the create request for the entity
    router.delete("/:id",
        authenticate,
        (req:Request,res:Response,_next:NextFunction) => {console.log("TODO:Validation RULES"); _next();}, //This seems silly actually their use could be handled on client side
        (_req:Request,_res:Response,_next:Function) => {console.log("TODO: VALIDATE",entity_name); _next()},
        (req: Request, res: Response) => {
            model.findOneAndDelete({_id:req.params.id},{})
                .then((dc) => {
                    if(dc)
                        res.status(200).send({message:`Successfully deleted ${entity_name} ${req.params.id}`})
                    else
                        res.status(404).send({message:`No such ${entity_name}`})
        })
                .catch((err) => {res.status(500).send({message:`failed to delete ${entity_name} ${req.params.id}`,err})})
        }
    );
}

/**
 * @overview will search the passed model type filtered by instances where the specified field matches the query param
 * @param endpoint:string - the endpoint to tie the request to
 * @param model:Model - the model to search for the valuek
 * @param router:Router - the router to add the request to
 * @param field:string - the name of the field to match against the query parameter
 * @param authenticate:Function - authentication function
 * @param entity_name:string - OPTIONAL - the name of the host entity
 */
function find_related<T>(endpoint:string, model:Model<T>,
                         router:Router,
                         field:string,
                         authenticate:(req:Request,res:Response,next:NextFunction)=>Promise<any>,
                         entity_name?:string){

    router.get(endpoint,
        authenticate,
        (req:Request,res:Response,_next:NextFunction) => {console.log("TODO:Validation RULES"); _next();}, //This seems silly actually their use could be handled on client side
        (_req:Request,_res:Response,_next:Function) => {console.log("TODO: VALIDATE",entity_name); _next()},
        (req: Request, res: Response) => {
            let filter :any= {}; //An empty object to build our query from
            filter[field] = req.params.id; // assign the filter @ the passed field, the value of the query param
            model.find(filter)
                .then((entities) => res.status(201).send(entities))
                .catch(err => res.status(404).send({message:`Failed to find ${endpoint} for ${entity_name}`,err}))
        }
    );}

export default {create,read_all,read_one,update_one,delete_one,find_related}