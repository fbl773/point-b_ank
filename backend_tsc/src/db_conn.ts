import * as mongoose from 'mongoose';
import dotenv from "dotenv";

export class Db_conn{
    public static async init(conn_string:string){
        return mongoose.connect(conn_string);
    }

    public static async db_close(){
        return mongoose.connection.close();//did not force... but I could have I guess
    }
}