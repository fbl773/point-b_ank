import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import catalogue_router from "./routes/catalogue";
import login_router from "./routes/access_control";



dotenv.config()

const port = process.env.PORT || 3000;
const connection_url = process.env.DB_CONN_STRING || "PLEASE SET DB_CONN_STRING IN .env TO MONGO CONNECTION URL";

//App config
const app: Express = express();
app.use(express.json());

/** ROUTES */
app.use("/catalogue",catalogue_router);
app.use("/login",login_router);


/** BASE*/
app.get('/', (req:Request,res:Response) => {
    res.send("Hello, this is api")
})

app.listen(port, () => {
    console.log(`listening on port: ${port},
mongo_url: ${connection_url}`);
})