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

const JWT_SECRET:Secret = process.env.JWT_SECRET || "NO SECRET";

/**
 * Performs the actual authentication
 * @overview pulls the token from the incoming request and checks its validity
 * @param req:AutorizedRequest - a requestthat has an authorization header field
 * @param res:Response - the response to forward
 */
async function do_authenticate(req:AuthorizedRequest, res:Response){
    //Grab the token
    let token = req.headers.authorization || "NO TOKEN";
    token = token.split(' ')[1];

    //if the token is bad, send them home
    if(token == null)
        return res.status(401).json({message:"Access denied. Invalid token"});

    //otherwise carry on
    jwt.verify(token,JWT_SECRET,{},(err,payload) => {
        //If it failed,  fail
        if(err)
            return res.status(401).json({message: "failed to authenticate",error:err});

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
        .catch(err => res.status(401).json({message:"Authentication failed",err}));
}

/**
 * Handles the signing of jwt tokens
 * @param uname - username to sign
 * @param role - role to sign
 * @return the signed token
 */
export function sign_token(uname:string,role:string):string{
    return jwt.sign({username: uname, role: role}, JWT_SECRET, {})
}

export default authenticate;