import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import catalogue_router from "./routes/catalogue";
import login_router from "./routes/access_control";
import sanitize from "express-mongo-sanitize"
import site_router from "./routes/site";
import period_router from "./routes/period";
import region_router from "./routes/region";
import {Db_conn} from "./utilities/db_conn";
import material_router from "./routes/material";
import culture_router from "./routes/culture";
import projectile_point_router from "./routes/projectile_point";



dotenv.config()
Db_conn.init("mongodb://localhost:27017/pblank","PBlank")
    .catch((err) => console.error("FAILED TO CONNECT TO DB",err));

const port = process.env.PORT || 3000;
const connection_url = process.env.DB_CONN_STRING || "PLEASE SET DB_CONN_STRING IN .env TO MONGO CONNECTION URL";

//App config
const app: Express = express();
app.use(express.json());
app.use(sanitize());

/** ROUTES */
app.use("/login",login_router);
app.use("/catalogue",catalogue_router);
app.use("/site",site_router);
app.use("/period",period_router);
app.use("/culture",culture_router);
app.use("/region",region_router);
app.use("/material",material_router);
app.use("/projectile_points",projectile_point_router);


//Event Listeners
const on_shutdown:EventListener = () => {
     Db_conn.db_close()
        .then(() => console.info(`Closed connection to ${connection_url}...`))
        .catch(err => console.warn("Failed to close DB connection! Attempting to force...",err))
        .then(() => Db_conn.db_close(true))
        .catch(err => console.error("Failed to force close DB Connection!",err));
}

//Graceful exit catchers
process.on("exit",on_shutdown);
process.on("SIGINT",on_shutdown);
process.on("SIGKILL",on_shutdown);
process.on("SIGTERM",on_shutdown);


/** BASE*/
app.get('/', (req:Request,res:Response) => {
    res.send("Hello, this is api")
})

app.listen(port, () => {
    console.log(`listening on port: ${port},
mongo_url: ${connection_url}`);
})
