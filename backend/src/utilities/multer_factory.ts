import multer from "multer"
import {Request,RequestHandler} from "express";
import path from "path";
import {upload_root} from "./file_utils"
import * as fs from "node:fs";

export class MulterFactory {
    private storage:multer.StorageEngine|null
    private multer:RequestHandler|null;
    private readonly dirname:string;
    private readonly file_fieldname:string;
    private readonly primary_id;
    private readonly secondary_id;
    public dest_gen: (req:Request,file:Express.Multer.File,cb:(error:Error|null,destination:string) => void) => void;
    public file_gen: (req:Request,file:Express.Multer.File,cb:(error:Error|null,destination:string) => void) => void;


    constructor(dirname:string,primary_id:string, file_fieldname:string, secondary_id?:string) {
        this.storage = null;
        this.multer = null;
        this.dirname = dirname;
        this.primary_id = primary_id;
        this.secondary_id = secondary_id ?? null;
        this.file_fieldname = file_fieldname;


        //Default destination generator
        this.dest_gen = (req:Request,_file,cb) => {
            let dirname = `${upload_root}/${this.dirname}/${req.params[this.primary_id]}`;
            fs.mkdirSync(dirname,{recursive:true});
            cb(null,dirname)
        }

        this.file_gen = (req,file,cb) => {
            let filename:string = file.originalname;
            if(this.secondary_id)
                filename = `${req.params[this.secondary_id]}${path.extname(file.originalname)}`;
            cb(null,filename);
        }
    }

    public create_single():RequestHandler<any>{
        this.storage = multer.diskStorage({
            destination:this.dest_gen,
            filename:this.file_gen
        })

        this.multer = multer({
            storage:this.storage
        }).single(this.file_fieldname)

        return this.multer;
    }

}