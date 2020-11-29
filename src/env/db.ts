import mysql, { PoolConnection } from "mysql";
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

export const getConn = (): Promise<PoolConnection> => {
	return new Promise((resolve, reject) => {
		pool.getConnection((err, conn) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			return resolve(conn)
		})
	})
}

export const beginTransaction = (conn: PoolConnection, sql: string, values: string | string[]): Promise<any> => {
	return new Promise((resolve, reject) => {
		conn.query(sql, values, (err, res) => {
			if (err) {
				conn.rollback(() => {
					logger.error(err);
					return reject(err);
				});
			}
			return resolve(res);
		})
	})
}

export const transactionCommit = (conn: PoolConnection) => {
	return new Promise((resolve, reject) => {
		conn.commit((err) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			return resolve();
		});
	})
}

export const singleTransaction = <T>(sql: string, values: string | string[]): Promise<T> => {
	return new Promise((resolve, reject) => {
		pool.getConnection((err, conn) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			conn.beginTransaction((err) => {
				if (err) {
					logger.error(err);
					throw err;
				}
	
				conn.query(sql, values, (err, res) => {
					if (err) {
						conn.rollback(() => {
							logger.error(err);
							return reject(err);
						});
					}
					conn.commit((err) => {
						logger.error(err);
						return reject(err);
					})
					return resolve();
 				})
			})
		})
	})
}

export default query