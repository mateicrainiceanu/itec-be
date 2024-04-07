import { RowDataPacket } from "mysql2";
import { db } from "../config/db";
import App from "./App";
import Bug from "./bug";
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

    static async checkEndpoints(endpointId: number) {
        let sql = `SELECT * FROM endpoints WHERE id = ${endpointId};`
        let [response] = (await db.execute(sql)) as Array<RowDataPacket>
        const { appId } = response[0];

        let sql2 = `SELECT * FROM endpoints WHERE appId = ${appId}`;
        let [endpoints] = (await db.execute(sql2)) as Array<RowDataPacket>

        var allOk = true
        var allEndpointsDown = true

        endpoints.map((ep: Endpoint) => {
            if (ep.status !== 0) {
                allOk = false;
            }
            if (ep.status === 0 || ep.status === 1) {
                allEndpointsDown = false;
            }
        })

        var newStatus: number

        if (allEndpointsDown) {
            newStatus = 2
        } else if (allOk) {
            newStatus = 0
        } else {
            newStatus = 1
        }

        const [bugs] =  (await Bug.getForApp(appId))

        if (bugs.length === 0) {
            const [result] = (await App.updateAppStatus(appId, newStatus)) as Array<RowDataPacket>
        } else {
            const [result] = (await App.updateAppStatus(appId, (newStatus === 0 ? 1 : newStatus))) as Array<RowDataPacket>
        }
    }
}


export default Endpoint