import {Model} from "mongoose"
import {NextFunction, Request, Response, Router} from "express";
import {IMongo_Entity} from "../entitites/mongo_entity";

function create<T extends IMongo_Entity>(model:Model<T>,
                         router:Router,
                         authenticate:(req:Request,res:Response,next:NextFunction)=>Promise<any>,
                         entity_name?:string){
    //Give the router the create request for the entity
    router.post("/",
        authenticate,
        (req:Request,res:Response,_next:NextFunction) => {console.log("TODO:Validation RULES"); _next();}, //This seems silly actually their use could be handled on client side
        (_req:Request,_res:Response,_next:Function) => {console.log("TODO: VALIDATE"); _next()},
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

function read_all<T>(model:Model<T>,
                           router:Router,
                           authenticate:(req:Request,res:Response,next:NextFunction)=>Promise<any>,
                           entity_name?:string){
    //Give the router the create request for the entity
    router.get("/",
        authenticate,
        (req:Request,res:Response,_next:NextFunction) => {console.log("TODO:Validation RULES"); _next();}, //This seems silly actually their use could be handled on client side
        (_req:Request,_res:Response,_next:Function) => {console.log("TODO: VALIDATE"); _next()},
        (req: Request, res: Response) => {
            model.find({})
                .then((entities) => res.status(201).send(entities))
                .catch(err => res.status(404).send({message:`Failed to find${entity_name}s`,err}))
        }
    );
}
function read_one<T>(model:Model<T>,
                           router:Router,
                           authenticate:(req:Request,res:Response,next:NextFunction)=>Promise<any>,
                           entity_name:string = "Unspecified Entity"){
    //Give the router the create request for the entity
    router.get("/:id",
        authenticate,
        (req:Request,res:Response,_next:NextFunction) => {console.log("TODO:Validation RULES"); _next();}, //This seems silly actually their use could be handled on client side
        (_req:Request,_res:Response,_next:Function) => {console.log("TODO: VALIDATE"); _next()},
        (req: Request, res: Response) => {
            model.findById(req.params.id ?? "NO ID")
                .then(cat => cat ? res.status(200).send(cat) :
                    res.status(404).send({message:`${entity_name} ${req.params.id} not found`}))
                .catch(err => res.status(404).send({message:`Failed to find ${entity_name} ${req.params.id}`,err}))
        }
    );
}

function update_one<T>(model:Model<T>,
                             router:Router,
                             authenticate:(req:Request,res:Response,next:NextFunction)=>Promise<any>,
                             entity_name?:string){
    //Give the router the create request for the entity
    router.put("/:id",
        authenticate,
        (req:Request,res:Response,_next:NextFunction) => {console.log("TODO:Validation RULES"); _next();}, //This seems silly actually their use could be handled on client side
        (_req:Request,_res:Response,_next:Function) => {console.log("TODO: VALIDATE"); _next()},
        (req: Request, res: Response) => {
            let new_ent = req.body;
            model.findOneAndUpdate({_id:req.params.id},new_ent,{new:true})
                .then((updated) => updated ?
                    res.status(200).send( { message:`Successfully updated ${req.params.id}`, updated}):
                    res.status(404).send({message:`Update Failed: ${entity_name} ${req.params.id} not found`})
                )
                .catch((err) => res.status(406).send({message:`failed to update ${entity_name} ${req.params.id}`,err}))
        }
    );
}
function delete_one<T>(model:Model<T>,
                             router:Router,
                             authenticate:(req:Request,res:Response,next:NextFunction)=>Promise<any>,
                             entity_name?:string){
    //Give the router the create request for the entity
    router.delete("/:id",
        authenticate,
        (req:Request,res:Response,_next:NextFunction) => {console.log("TODO:Validation RULES"); _next();}, //This seems silly actually their use could be handled on client side
        (_req:Request,_res:Response,_next:Function) => {console.log("TODO: VALIDATE"); _next()},
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


export default {create,read_all,read_one,update_one,delete_one}