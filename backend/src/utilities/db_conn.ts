import * as mongoose from 'mongoose';

export class Db_conn{

    /**
     * Initializes the DB connection
     * @param conn_string:string - Connection string for the mongo instance
     * @param caller:string - the name of the entity calling for DB initialization for logging purposes
     */
    public static async init(conn_string:string,caller:string = "Unkown Caller"){
        return mongoose.connect(conn_string)
            .then(() => console.log(`${caller} connected to db @ ${conn_string}`))
            .catch((err) => {
                console.log(`${caller} FAILED connected to db @ ${conn_string}: ${err}`)
            });
    }

    /**
     * Closes the DB Connection
     * @param force:boolean - do we force close the database? default false.
     */
    public static async db_close(force:boolean = false){
        return mongoose.disconnect();
    }
}