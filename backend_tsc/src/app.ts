import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import catalogue_router from "./routes/catalogue";
import login_router from "./routes/access_control";
import sanitize from "express-mongo-sanitize"
import site_router from "./routes/site";
import period_router from "./routes/period";



dotenv.config()

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


/** BASE*/
app.get('/', (req:Request,res:Response) => {
    res.send("Hello, this is api")
})

app.listen(port, () => {
    console.log(`listening on port: ${port},
mongo_url: ${connection_url}`);
})