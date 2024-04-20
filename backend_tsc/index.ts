import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";

dotenv.config()

const app: Express = express();
const port = process.env.PORT || 3000;

app.get('/', (req:Request,res:Response) => {
    res.send("Hello, this is api")
})

app.listen(port, () => {
    console.log("We got one!")
})