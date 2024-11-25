import {Request, Response, NextFunction, Router, RequestHandler} from "express";
import multer from "multer";

function upload_one(router:Router,
                authenticate:(req:Request,res:Response,next:NextFunction)=>Promise<any>,
                do_upload :(req:Request,res:Response,next:NextFunction)=>RequestHandler<any>,
                endpoint:string,
                entity_name?:string){
    router.post(endpoint,
        authenticate,
        do_upload,
        (_,res:Response)=>{
            res.status(200).json({message:"Uploaded file successfully"})
        }
        )
}

export default{upload_one}