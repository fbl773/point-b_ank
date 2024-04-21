import express, {Express, NextFunction, Request, Response, Router} from "express";
import {Db_conn} from "../db_conn";
import Catalogue, {ICatalogue} from "../entitites/catalogue";

const _db_conn = Db_conn.init("mongodb://localhost:27017/pblank","Catalogue_Router")

const catalogue_router = Router();

catalogue_router.post("/",
    (_req:Request,_res:Response,_next:NextFunction) => {console.log("TODO: Authenticate Admin"); _next()},
    (req:Request,res:Response,_next:NextFunction) => {console.log("TODO:Validation RULES"); _next();}, //This seems silly actually their use could be handled on client side
    (_req:Request,_res:Response,_next:Function) => {console.log("TODO: VALIDATE"); _next()},
    async (req:Request, res:Response) => {
        let new_cat:ICatalogue = req.body;
        await Catalogue.create(new_cat)
            .then((nc) => res.status(201).send({id:nc._id}))
            .catch((err) => res.status(500).json(err));
    }
);

export default catalogue_router



