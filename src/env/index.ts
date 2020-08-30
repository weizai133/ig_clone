const dbHost: string = process.env.dbHost || 'localhost';
const dbUser: string = process.env.dbUser || 'root';
const dbPassword: string = process.env.dbPasswor || 'root';
const dbName: string = process.env.dbName || 'ig_clone';
const port: number | string = process.env.port || 3001;

const database = {
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName
}

export default { database, port }