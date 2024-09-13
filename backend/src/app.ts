import express, {Express, Request, Response, Router} from "express";
import dotenv from "dotenv";
import catalogue_router from "./routes/catalogue";
import {login_router, access_control_router} from "./routes/access_control";
import sanitize from "express-mongo-sanitize"
import site_router from "./routes/site";
import period_router from "./routes/period";
import region_router from "./routes/region";
import {Db_conn} from "./utilities/db_conn";
import material_router from "./routes/material";
import culture_router from "./routes/culture";
import projectile_point_router from "./routes/projectile_point";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";
import user_router from "./routes/user";



dotenv.config()

const port = process.env.PORT || 3000;
const connection_url = process.env.DB_CONN_STRING || "PLEASE SET DB_CONN_STRING IN .env TO MONGO CONNECTION URL";

Db_conn.init(connection_url,"PBlank")
    .catch((err) => console.error("FAILED TO CONNECT TO DB",err));

/* App config*/
const app: Express = express();
app.use(express.json());
app.use(sanitize());
app.use(cookieParser());
app.use(bodyParser.json());

// CORS
app.use(cors({
    origin:"http://localhost:8080",
    methods:["POST","GET","DELETE","PATCH","PUT"],
    credentials:true
}));

const demo_use = (url:String,router:Router) => app.use(`api${url}`,router)

/** ROUTES */
demo_use("/login",login_router);
demo_use("/verify",access_control_router);
demo_use("/catalogues",catalogue_router);
demo_use("/sites",site_router);
demo_use("/materials",material_router);
demo_use("/periods",period_router);
demo_use("/cultures",culture_router);
demo_use("/regions",region_router);
demo_use("/artifacts",projectile_point_router);//TODO remove after frontend refactor
demo_use("/projectilepoints",projectile_point_router); //TODO remove after frontend refactor
demo_use("/points",projectile_point_router);
demo_use("/users",user_router);

/** Handler for discontinued routes
 * TODO: Remove once frontend refactor is complete */
const unimplemented_router = Router();
unimplemented_router.all("/",(_req,res) => {
    return res.status(501).send({message:"This feature is under construction"})
})

demo_use("/aggregateStatisticsGenerators",unimplemented_router);
demo_use("/bladeshapes", unimplemented_router);
demo_use("/baseshapes", unimplemented_router);
demo_use("/haftingshapes", unimplemented_router);
demo_use("/crosssections", unimplemented_router);
demo_use("/artifacttypes", unimplemented_router);
demo_use("/users/resetDefaultUser",unimplemented_router);

app.use("api/uploads", express.static(path.join(__dirname, "uploads")));


/** BASE*/
app.get('/api', (req:Request,res:Response) => {
    res.send("Hello, this is api")
})

const pblank_api = app.listen(port, () => {
    console.log(`listening on port: ${port},
mongo_url: ${connection_url}`);
})

//Cleanup actions
const on_shutdown:EventListener = () => {
    pblank_api.close(() => {
        console.warn("Server going down!")
        Db_conn.db_close()
            .then(() => console.info(`Closed connection to ${connection_url}...`))
            .catch(err => console.warn("Failed to close DB connection!",err))
    });
}

//Exit event listeners
process.on("exit",on_shutdown);
process.on("SIGINT",on_shutdown);
