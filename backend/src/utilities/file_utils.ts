import {Request, Response, NextFunction, Router, RequestHandler} from "express";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
            destination: (req,file,cb) => {
                let dirname = `./uploads/sites/${req.params.site_id}`
                cb(null,dirname)
            },
            filename: (req,file,cb) => {
                let filename = `${req.params.point_id}${path.extname(file.originalname)}`
                cb(null,filename);
            }
    })

const do_upload = multer({
    storage: storage,
}).single("file");

function upload_one(router: Router,
                    authenticate: (req: Request, res: Response, next: NextFunction) => Promise<any>,
                    endpoint: string,
                    entity_name?: string){
    router.post(endpoint,
        authenticate,
        (req:Request,res:Response)=>{
            do_upload(req,res,err => {
                if(err){
                    console.error(err)
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            })
            console.log("THis should just work no?")
        })
}

export default{upload_one}