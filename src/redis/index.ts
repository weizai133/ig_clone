import redis from "redis";
import Redlock from "redlock";
import logger from "../env/logger";

type redisGetValue = string | null | Error

export const redisClient = redis.createClient();

export const redlock = new Redlock([redisClient], {
  driftFactor: 0.01,
  retryCount:  10,
  retryDelay:  200,
  retryJitter:  200
});

export const getValue = (key: string): Promise<redisGetValue> => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, value) => {
      if (err) return reject(err);
      return resolve(value);
    })
  })
}

export const setValue = (key: string, value: string) => new Promise((resolve) => redisClient.set(key, value, resolve));

export const lPush = (key: string, value: string | Array<string>): Promise<number | null> => {
  return new Promise((resolve, reject) => {
    redisClient.lpush(key, value, (err, res) => {
      if (err) return reject(err);
      return resolve(res)
    })
  })
}

export const lrange = (key: string, start: number, end: number): Promise<Array<string>> => {
  return new Promise((resolve, reject) => {
    redisClient.lrange(key, start, end, (err, res) => {
      if (err) return reject(null);
      return resolve(res)
    })
  })
}

export const sadd = (key: string, value: string) => {
  return new Promise((resolve, reject) => {
    redisClient.sadd(key, value, (err, res) => {
      if (err) return reject(null);
      return resolve(res);
    })
  })
}

export const smembers = (key: string): Promise<Array<string>> => {
  return new Promise((resolve, reject) => {
    redisClient.smembers(key, (err, res) => {
      return resolve(res);
    })
  })
}

export const sismember = (key: string, member: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    redisClient.sismember(key, member, (err, res) => {
      if (err) {
        logger.error(err);
        return reject(err);
      }
      return resolve(res);
    })
  })
}

interface GenericMap {
  [key: string]: any
}

export const hmset = <T extends GenericMap>(key: string, obj: T) => {
  return new Promise((resolve, reject) => {
    redisClient.hmset(key, obj, (err, res) => {
      if (err) return reject(err);
      return resolve(res)
    })
  })
}

export const expire = (key: string, seconds: number) => {
  return new Promise((resolve, reject) => {
    redisClient.expire(key, seconds, (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    })
  });
}

export const hexists = (key: string, field: string) => {
  return new Promise((resolve, reject) => {
    redisClient.hexists(key, field, (err, res) => {
      if (err) return reject(err);
      return resolve(res)
    })
  })
}

export const hkeys = (key: string): Promise<Array<string>> => {
  return new Promise((resolve, reject) => {
    redisClient.hkeys(key, (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    })
  })
}

export const hget = (key: string, field: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    redisClient.hget(key, field, (err, res) => {
      if (err) return reject(err);
      return resolve(res)
    })
  })
}

export const hdel = (key: string, field: string) => {
  return new Promise((resolve, reject) => {
    redisClient.hdel(key, field, (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    })
  })
}

export const srem = (key: string, member: string | string[]): Promise<number | null | Error> => {
  return new Promise((resolve, reject) => {
    redisClient.srem(key, member, (err, res) => {
      if (err) {
        logger.error(err);
        return reject(err);
      } else if (res === 0) {
        logger.error(`${key} has not "${member}"`);
        return reject(null);
      }
      return resolve(res);
    })
  })
}