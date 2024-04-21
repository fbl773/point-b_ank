import e, { NextFunction, Request, Response, Router} from "express";
import {Db_conn} from "../db_conn";
import User, {IUser} from "../entitites/user";
import dotenv from "dotenv";
import jwt, {Secret,JwtPayload} from "jsonwebtoken";
import bcrypt from "bcrypt";
import user from "../entitites/user";

dotenv.config()
const _db_conn = Db_conn.init("mongodb://localhost:27017/pblank","Access_Control_Router")
const JWT_SECRET = process.env.JWT_SECRET || "NO SECRET";
const salt_rounds = 10;
const login_router = Router();

async function init_login(req:Request,res:Response){

    console.log(`init login with: ${JSON.stringify(req.body)}`)

    //Check for default password
    let default_password = process.env.DEFAULT_PASSWORD || null;

    if(default_password == null)
        return res.status(406).json({message:"DEFAULT PASSWORD NOT SPECIFIED"});

    //hash the default password
    let password_hashed = await bcrypt.hash("admin",salt_rounds)

    //create the default user
    let default_admin:any = {
        role:"admin",
        username:process.env.DEFAULT_USERNAME,
        password:password_hashed,
    };

    console.log(`CREATING USER: ${JSON.stringify(default_admin)}`);

    //If we don't have one, create the default admin user
    let admin_user:IUser = default_admin;
    await User.create(admin_user)
        .catch((err) => res.status(500).json({
            message:"Failed to perform initial login",
            err:err
        }));

    //then proceed with login
    return await login(req,res);
}


async function login(req:Request,res:Response){
    console.log(`in login with: ${JSON.stringify(req.body)}`);
    let {username,password} = req.body;
    return await User.findOne({username:username})
        .then(async (existing_user) => {
            //Check password
            let existing_password = existing_user?.password || "NOT POSSIBLE";
            await bcrypt.compare(password,existing_password)
                .then((match)=>{
                    if(!match)
                        return res.status(401).json({message: "check username and password"});

                    let token = jwt.sign({username: username, role: existing_user?.role}, JWT_SECRET, {})
                    return res.status(202).json({
                        token,
                        message: "User Successfully logged in",
                        role: existing_user?.role
                    });
                });
        })
        .catch((err:any) => {
            console.error(`Failed to login user: ${username}: ${err}`);
            return res.status(401).json({message:"Unauthorized"});
        })
}

login_router.post("/",
    (_req:Request,_res:Response,_next:NextFunction) => {console.log("TODO: Authenticate Admin"); _next()},
    (req:Request,res:Response,_next:NextFunction) => {console.log("TODO:Validation RULES"); _next();}, //This seems silly actually their use could be handled on client side
    (_req:Request,_res:Response,_next:Function) => {console.log("TODO: VALIDATE"); _next()},
    async (req: Request, res: Response) => {
        console.log(`received: ${JSON.stringify(req.body)}`);
        let has_admin = await User.findOne({role: 'admin'});
        if(!has_admin)
            return init_login(req,res);
        else
            return login(req,res);
    }
);

export default login_router



