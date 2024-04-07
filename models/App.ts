import { db } from "../config/db"

interface App {
    ownerId: number,
    name: string,
    description: string,
    homepage: string,
    status: number
}

class App {
    constructor(ownerId: number, name: string, description: string, homepage: string, status: number) {
        this.ownerId = ownerId;
        this.name = name;
        this.description = description;
        this.homepage = homepage;
        this.status = status;
    }

    async save() {
        let sql = `INSERT INTO apps 
        (ownerId, name, description, homepage, status)
         VALUES (
            ${this.ownerId},
            '${this.name}',
            '${this.description}',
            '${this.homepage}',
            '${this.status}'
         );
        `;

        return db.execute(sql);
    }

    static getForUserId(id: number) {
        let sql = `
        SELECT * FROM apps WHERE ownerId = ${id};`
        return db.execute(sql);
    }

    static getForAppId(id: number) {
        let sql = `SELECT * FROM apps WHERE id = ${id};`
        return db.execute(sql)
    }

    static updateAppStatus(id: number, status: number) {
        let sql = `
        UPDATE apps SET status = ${status} 
        WHERE id = ${id};
        `
        return db.execute(sql)
    }
}

export default App;