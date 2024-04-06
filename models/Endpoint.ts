import { db } from "../config/db";

interface Endpoint {
    id: number,
    appId: number,
    url: string,
    status: number
}

class Endpoint {

    static getEndpoints() {
        let sql = `
        SELECT * FROM endpoints;
        `
        return db.execute(sql);

    }

    static changeStatus(id: number, status: number) {
        let sql = `
        UPDATE endpoints SET status = ${status} WHERE id = ${id};`
        return db.execute(sql);
    }
}


export default Endpoint