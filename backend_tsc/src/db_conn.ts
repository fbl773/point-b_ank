import * as mongoose from 'mongoose';
import dotenv from "dotenv";

export class Db_conn{
    public static async init(conn_string:string,caller?:string){
        return mongoose.connect(conn_string)
            .then(() => console.log(`${caller ??"Unknown Caller"} connected to db @ ${conn_string}`))
            .catch((err) => {
                console.log(`${caller ?? "Unknown Caller"} FAILED connected to db @ ${conn_string}: ${err}`)
            });
    }

    public static async db_close(){
        return mongoose.connection.close();//did not force... but I could have I guess
    }
}