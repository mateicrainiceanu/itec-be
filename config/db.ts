import mysql from "mysql2";
import * as dotenv from 'dotenv';

dotenv.config()

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
})

const db = pool.promise();

export {db};
