import {Router} from "express";
import Period, {IPeriod} from "../entitites/period";
import authenticate from "../utilities/jwt_utils";
import crud_factory from "../utilities/crud_factory";

const period_router= Router();

/* Give them the CRUD treatment*/
crud_factory.create<IPeriod>(Period,period_router,authenticate,"period") //Handles POST /period
crud_factory.read_all<IPeriod>(Period,period_router,authenticate,"period") // handles GET /period
crud_factory.read_one<IPeriod>(Period,period_router,authenticate,"period") // handles GET /period/:id
crud_factory.update_one<IPeriod>(Period,period_router,authenticate,"period") // handles PUT /period/:id
crud_factory.delete_one<IPeriod>(Period,period_router,authenticate,"period") // handles DELETE /period/:id

export default period_router;