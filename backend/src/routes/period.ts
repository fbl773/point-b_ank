import {Router} from "express";
import Period, {IPeriod} from "../entitites/period";
import Culture, {ICulture} from "../entitites/culture";
import authenticate from "../utilities/jwt_utils";
import crud_factory from "../utilities/crud_factory";
import ProjectilePoint, {IProjectilePoint} from "../entitites/projectile_point";

const period_router= Router();

/* Give them the CRUD treatment*/
crud_factory.create<IPeriod>(Period,period_router,authenticate,"period");
crud_factory.read_all<IPeriod>(Period,period_router,authenticate,"period");
crud_factory.read_one<IPeriod>(Period,period_router,authenticate,"period");
crud_factory.update_one<IPeriod>(Period,period_router,authenticate,"period");
crud_factory.delete_one<IPeriod>(Period,period_router,authenticate,"period");

// Specialty endpoints

crud_factory.find_related<ICulture>("/:id/cultures",Culture,period_router,
    "period_id", authenticate,"period");

crud_factory.find_related<IProjectilePoint>("/:id/points",ProjectilePoint,period_router,
    "period_id", authenticate,"period");


export default period_router;