import redis from "redis";
import { promisify } from "util";

type redisGetValue = string | null | Error

export const redisClient = redis.createClient();

export const getValue = (key: string): Promise<redisGetValue> => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, value) => {
      if (err) reject(err)
      resolve(value);
    })
  })
}

export const setValue = (key: string, value: string) => new Promise((resolve) => redisClient.set(key, value, resolve));

export const setAsync = promisify(redisClient.set);

export const lPush = (key: string, value: string | Array<string>): Promise<number | null> => {
  return new Promise((resolve, reject) => {
    redisClient.lpush(key, value, (err, res) => {
      if (err) return reject(err);
      resolve(res)
    })
  })
}

export const lrange = (key: string, start: number, end: number): Promise<Array<string>> => {
  return new Promise((resolve, reject) => {
    redisClient.lrange(key, start, end, (err, res) => {
      if (err) reject(null)
      resolve(res)
    })
  })
}