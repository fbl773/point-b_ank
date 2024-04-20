import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import {Db_conn} from "./db_conn";
import Catalogue, {ICatalogue} from './entitites/catalogue';



dotenv.config()

const port = process.env.PORT || 3000;
const connection_url = process.env.DB_CONN_STRING || "mongodb://localhost:27017/pblank";

//App config
const app: Express = express();
app.use(express.json());

const db_conn = Db_conn.init(connection_url);


app.get('/', (req:Request,res:Response) => {
    res.send("Hello, this is api")
})

app.post('/catalogue', async (req: Request, res: Response) => {
    let cat: ICatalogue = req.body;
    let new_cat = await Catalogue.create(cat)
    let recvd: string = JSON.stringify(new_cat);
    console.log(new_cat);
    res.status(200).send({message: "Received Catalogue", did_rec: cat})
})

app.listen(port, () => {
    console.log("We got one!")
})