import express, {Express, Request, Response} from "express";
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



dotenv.config()
Db_conn.init("mongodb://localhost:27017/pblank","PBlank")
    .catch((err) => console.error("FAILED TO CONNECT TO DB",err));

const port = process.env.PORT || 3000;
const connection_url = process.env.DB_CONN_STRING || "PLEASE SET DB_CONN_STRING IN .env TO MONGO CONNECTION URL";

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

/** ROUTES */
app.use("/login",login_router);
app.use("/verify",access_control_router);
app.use("/catalogues",catalogue_router);
app.use("/sites",site_router);
app.use("/materials",material_router);
app.use("/periods",period_router);
app.use("/cultures",culture_router);
app.use("/regions",region_router);
app.use("/points",projectile_point_router);


/** BASE*/
app.get('/', (req:Request,res:Response) => {
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
