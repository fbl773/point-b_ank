import {Request, Response, NextFunction, Router, RequestHandler} from "express";

function upload_one(router:Router,
                authenticate:(req:Request,res:Response,next:NextFunction)=>Promise<any>,
                do_upload :(req:Request,res:Response)=>RequestHandler<any>,
                endpoint:string,
                entity_name?:string){
    router.post(endpoint,
        authenticate,
        do_upload,
        (_,res:Response)=>{
            console.log("RECEIVED UPLOAD CALL")
            res.json({message:"RECEIVED UPLOAD"});
        })
}

export default{upload_one}