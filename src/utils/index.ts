import { Fetch_Posts } from "../modals/Post";
import { rPush, expire } from "../redis";
import logger from "../env/logger";

export const preLoadPostsList = (key: string, data: Array<Fetch_Posts>): Promise<Array<Fetch_Posts> | null> => {
  return new Promise(async (resolve, reject) => {
    try {
      await rPush(key, data.map(val => JSON.stringify(val)));
      await expire(key, 30000);
      resolve() 
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  })
}