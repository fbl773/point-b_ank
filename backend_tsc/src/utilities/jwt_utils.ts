import {NextFunction, Request, Response} from "express";
import jwt, {JwtPayload,Secret} from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()

/* TYPES */

/**
 * @overview a special request type that allows for tokens to be recognized as a field
 * @field token:string | JwtPayload | undefined - holds whatever the "verify" call produces when verifying a jwt
 */
type AuthorizedRequest = Request & {
    token: string | JwtPayload | undefined;
}

/**
 * THe data stored in a jwt token, as an accessible type for checking the role
 * @field _id:string - mongo user objectid
 * @field username:string - username stored in the token
 * @field role:string - the role stored in the token
 */
export type TokenData = {
    _id:string,
    username:string,
    role:string
}

const JWT_SECRET:Secret = process.env.JWT_SECRET || "NO SECRET";

export function get_payload(req:Request):TokenData{
    let as_auth = req as AuthorizedRequest;
    if (as_auth.token == undefined)
        throw Error("NO TOKEN IN REQUEST")
    else if (as_auth.token instanceof String)
        throw Error("MALFORMED TOKEN")
    else
        return (req as AuthorizedRequest).token as TokenData;
}

/**
 * Performs the actual authentication
 * @overview pulls the token from the incoming request and checks its validity
 * @param req:AutorizedRequest - a requestthat has an authorization header field
 * @param res:Response - the response to forward
 */
async function do_authenticate(req:AuthorizedRequest, res:Response):Promise<void>{
    //Grab the token
    let token = req.headers.authorization || "NO TOKEN";
    token = token.split(' ')[1];

    //if the token is bad, send them home
    if(token == null)
        throw Error("Invalid Token");

    //otherwise carry on
    jwt.verify(token,JWT_SECRET,{},(err,payload) => {
        //If it failed,  fail
        if(err)
            throw Error("Failed to verify token");

        //If it did not fail, assign token and cary on
        req.token = payload;
    });
}

/**
 * Wraps the authentication call in a request type that permits a token field
 * @param req - the request to authenticate
 * @param res - response to build
 * @param next - whatever we do after...
 */
async function authenticate(req:Request,res:Response,next:NextFunction){
    return do_authenticate(req as AuthorizedRequest,res)
        .then(next)
        .catch( (err:Error) => res.status(401).json({message:"Authentication failed",error:err.message}));
}

/**
 * Handles the signing of jwt tokens
 * @overview Decides what payload will be stored inside of a JWT token.
 * @param id - the object id of the user
 * @param uname - username to sign
 * @param role - role to sign
 * @return the signed token containing the passed payload
 */
export function sign_token(id: string, uname: string, role: string):string{
    return jwt.sign({_id: id,username: uname, role: role,}, JWT_SECRET, {})
}

export default authenticate;