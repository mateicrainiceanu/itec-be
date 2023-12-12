import { db } from "../config/db"

interface User {
    name:string, 
    email: string,
    password: string
}

class User {
    constructor(email:string, password:string) {

        this.email = email;
        this.password = password;
    }

    async save() {
        let sql = `
        INSERT INTO users (
             email, password
        ) 
        VALUES (
            '${this.email}',
            '${this.password}'
        );`

        return db.execute(sql);
    }

    static findByEmail(email:string) {
        let sql = `
            SELECT * FROM users WHERE email = "${email}"
        `
        return db.execute(sql);
    }

    static saveToken(userId: number, tok: string) {
        let sql = `
            UPDATE users 
            SET token="${tok}"
            WHERE id=${userId};
        `
        return db.execute(sql)
    }

    
}

export {User};