import { NextFunction, Request, Response, Router} from "express";
import {Db_conn} from "../db_conn";
import User, {IUser} from "../entitites/user";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import {sign_token} from "../utilities/jwt_utils";

dotenv.config()

/* CONSTANTS */
const _db_conn = Db_conn.init("mongodb://localhost:27017/pblank","Access_Control_Router")
const salt_rounds = 10;
const login_router = Router();


/* HELPERS */
/**
 * Handles the case when no admin user exists - the intial login
 * @overview When the server is first started, there are no known users in the database.
 * To handle this case, the admin user is created and logged in
 * @param req:{body:{username:string,password:string}} - the request containing the credentials
 * @param res:Response - a handle to the response object
 */
async function init_login(req:Request,res:Response){

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

    //Since we don't have one, create the default admin user
    let admin_user:IUser = default_admin;
    await User.create(admin_user)
        .catch((err) => res.status(500).json({
            message:"Failed to perform initial login",
            err:err
        }));

    //then proceed with login
    return await login(req,res);
}

/**
 * Handles the standard login case
 * @param req:{body:{username:string,password:string}} - the request containing the credentials
 * @param res:Response - response handle
 */
async function login(req:Request,res:Response){

    // capture the json payload
    let {username,password} = req.body;

    //Check if user exists
    return await User.findOne({username:username})
        .then(async (existing_user) => {
            //if so, grab the password
            let existing_password = existing_user?.password || "NOT POSSIBLE";

            //Compare its hash
            await bcrypt.compare(password,existing_password)
                .then((match)=>{

                    //If the password is incorrect, send a 401
                    if(!match)
                        return res.status(401).json({message: "check username and password"});

                    //Otherwise generate them a token, send it back with a 202
                    let token = sign_token(
                        existing_user?._id.toString() || "NO ID",
                        username,
                        existing_user?.role || "NO ROLE"
                    );


                    return res.status(202).json({
                        token,
                        message: "User Successfully logged in",
                        role: existing_user?.role
                    });
                });
        })
        .catch((err:any) => {
            //If there was no user found, that's a 401.
            console.error(`Failed to login user: ${username}: ${err}`);
            return res.status(401).json({message:"Unauthorized"});
        })
}

/*ROUTES*/
login_router.post("/",
    (req:Request,res:Response,_next:NextFunction) => {console.log("TODO:Validation RULES"); _next();}, //This seems silly actually their use could be handled on client side
    (_req:Request,_res:Response,_next:Function) => {console.log("TODO: VALIDATE"); _next()},
    async (req: Request, res: Response) => {
        let has_admin = await User.findOne({role: 'admin'});
        if(!has_admin)
            return init_login(req,res);
        else
            return login(req,res);
    }
);

export default login_router



