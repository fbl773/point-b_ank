import {NextFunction, Request, Response, Router} from "express";
import Period, {IPeriod} from "../entitites/period";
import authenticate from "../utilities/jwt_utils";
import crud_factory from "../utilities/crud_factory";
import Site from "../entitites/site";
import catalogue_router from "./catalogue";

const period_router= Router();

/* Give them the CRUD treatment*/
crud_factory.create<IPeriod>(Period,period_router,authenticate,"period") //Handles POST /period
crud_factory.read_all<IPeriod>(Period,period_router,authenticate,"period") // handles GET /period
crud_factory.read_one<IPeriod>(Period,period_router,authenticate,"period") // handles GET /period/:id
crud_factory.update_one<IPeriod>(Period,period_router,authenticate,"period") // handles PUT /period/:id
crud_factory.delete_one<IPeriod>(Period,period_router,authenticate,"period") // handles DELETE /period/:id

// Specialty endpoints
catalogue_router.get(":id/cultures",
    authenticate,
    (req:Request,res:Response,_next:NextFunction) => {console.log("TODO:Validation RULES"); _next();}, //This seems silly actually their use could be handled on client side
    (_req:Request,_res:Response,_next:Function) => {console.log("TODO: VALIDATE"); _next()},
    (req: Request, res: Response) => {
        //adjust the filter to have the query param
        Culture.find({period_id:req.params.id})
            .then((entities) => res.status(201).send(entities))
            .catch(err => res.status(404).send({message:`Failed to find points for site ${req.params.id}`,err}))
    }
);
export default period_router;