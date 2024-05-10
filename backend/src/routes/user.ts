import {Request, Response, Router} from "express";
import User, {IUser} from "../entitites/user";
import authenticate, {authenticate_admin, get_payload, TokenData} from "../utilities/jwt_utils";
import crud_factory from "../utilities/crud_factory";
import bcrypt from "bcrypt";

const user_router= Router();

/* Give them the CRUD treatment*/
crud_factory.create<IUser>(User,user_router,authenticate_admin,"user");
crud_factory.read_all<IUser>(User,user_router,authenticate_admin,"user");
crud_factory.read_one<IUser>(User,user_router,authenticate_admin,"user");
crud_factory.delete_one<IUser>(User,user_router,authenticate_admin,"user");

user_router.patch(
    "/changeUsername",
    authenticate_admin,
    async (req: Request, res: Response) => {
        let updated_user:IUser = req.body; // the incoming changes to Uname
        let payload:TokenData = get_payload(req); // the creds attached to the token

        //check password matches
        User.findById(payload._id)
            .then(async (found_user )=> {
                let existing_password = found_user?.password || "NOT POSSIBLE";
                await bcrypt.compare(updated_user.password,existing_password)
                    .then(match => {
                        //If the update had the wrong password, don't update it...
                        if(!match)
                            return res.status(401).send({message:"check provided password"})

                        //Do the update (allegedly)
                        if(found_user) {
                            found_user.username = updated_user.username
                            found_user.save();
                        }

                        return res.status(200).send({message:`succesfully updated user ${payload._id}`,user:found_user})
                    })
                    .catch(err => res.status(500).send({message:`failed to update user ${payload._id}`,err}))

            })

    }
)

user_router.patch(
    "/changePassword",
    authenticate_admin,
    async (req: Request, res: Response) => {
        let updated_user:IUser = req.body; // the incoming changes to Uname
        let payload:TokenData = get_payload(req); // the creds attached to the token

        //check password matches
        User.findById(payload._id)
            .then(async (found_user )=> {
                let existing_password = found_user?.password || "NOT POSSIBLE";
                await bcrypt.compare(updated_user.password,existing_password)
                    .then(async match => {
                        //If the update had the wrong password, don't update it...
                        if (!match)
                            return res.status(401).send({message: "check provided password"})

                        //Do the update (allegedly)
                        if (found_user) {
                            let hashed_password = await bcrypt.hash(updated_user.password, 10);
                            found_user.password = hashed_password;
                            await found_user.save()
                                .then(() => res.status(200).send({message:`succesfully updated password for user ${payload._id}`}))
                                .catch((err) => res.status(500).send({message:`failed to update user ${payload._id}`,err}));
                        }
                    })
                })
                .catch(err => res.status(500).send({message:`failed to update user ${payload._id}`,err}))
    })

export default user_router;