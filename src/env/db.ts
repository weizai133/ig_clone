import mysql from "mysql";
import logger from "./logger";
import config from "./index";

type queryOptions = object | Array<string> | null | undefined | Function

var pool = mysql.createPool({ ...config.database });

const query = (sql: string, options: queryOptions, callback: Function) =>{
	if (typeof options === "function") {
		callback = options;
		options = undefined;
	}
	pool.getConnection((err, conn) => {
		if(err) {
			logger.error(err);
			callback(err, null, null);
		}
		else{
			conn.query(sql, options, (err, result, fields)=>{
				callback(err, result, fields);
			});
			conn.release();
		}
	})
}

export default query