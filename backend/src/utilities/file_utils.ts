import {Request, Response, NextFunction, Router, RequestHandler} from "express";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

//TODO: Comment & Cleanup

export const upload_root = process.env.UPLOAD_ROOT ?? "/srv/point-b_ank/backend/uploads";

function upload_one(router: Router,
                    authenticate: (req: Request, res: Response, next: NextFunction) => Promise<any>,
                    do_upload: RequestHandler<any>,
                    endpoint: string,
                    entity_name?: string){
    router.post(endpoint,
        authenticate,
        do_upload,
        (req:Request,res:Response)=>{
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
        let file_name = `${host_dir}/${req.params[primary_id]}/${req.params[secondary_id]}`;
        console.log(`Would fetch from to ${upload_root}-${file_name})`);
        res.sendFile(path.join(upload_root,file_name));
    })
}

function delete_one(router: Router,
                    authenticate: (req: Request, res: Response, next: NextFunction) => Promise<any>,
                    do_delete: (req: Request, res: Response,next:NextFunction) => Promise<any>,
                    endpoint: string,
){
    router.delete(endpoint,
        authenticate,
        do_delete,
        (req:Request, res:Response)=>{
        console.log('returning...')
            res.status(200).send({
                message:`successfully deleted ${req.params.file_name}`,
                filename:req.params.file_name
            });
        })

}

export default{upload_one,get_img,delete_one}