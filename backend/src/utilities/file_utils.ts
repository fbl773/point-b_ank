import {Request, Response, NextFunction, Router, RequestHandler} from "express";

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

export default{upload_one}