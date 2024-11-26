import {Request, Response, NextFunction, Router, RequestHandler} from "express";
import path from "path";

function upload_one(router: Router,
                    authenticate: (req: Request, res: Response, next: NextFunction) => Promise<any>,
                    do_upload: RequestHandler<any>,
                    endpoint: string,
                    entity_name?: string){
    router.post(endpoint,
        authenticate,
        do_upload,
        (req:Request,res:Response)=>{
            //do_upload(req,res,err => {
            //})
            console.log("THis should just work no?")
        })
}

function get_img(router: Router,
                      authenticate: (req: Request, res: Response, next: NextFunction) => Promise<any>,
                      endpoint: string,
                      host_dir: string,
                      primary_id:string,
                      secondary_id:string){
    router.get(endpoint,
        authenticate,
        (req:Request, res:Response)=>{
        let file_name = `uploads/${host_dir}/${req.params[primary_id]}/${req.params[secondary_id]}` + ".JPG";
        console.log(`TRYING TO GET ${file_name}`);
        res.sendFile(path.join("/Users/FrankyB/fGrams/Projects/point-b_ank/backend",file_name));
    })
}

export default{upload_one,get_img}