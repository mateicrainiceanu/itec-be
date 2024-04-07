import { RowDataPacket } from "mysql2";
import { db } from "../config/db";
import Endpoint from "./Endpoint";

interface Check {
    id?: number,
    endpointId: number,
    status: number,
    code: number
}

class Check {
    constructor(endpointId: number, code: number) {
        this.endpointId = endpointId;
        this.code = code;
        this.status = (code === 200 || code === 300 ? 0 : 1)
    }

    async save() {
        let sql = `INSERT INTO checks (endpointId, status, code) VALUES (
            ${this.endpointId}, 
            ${this.status},
            ${this.code}
        );`

        return (db.execute(sql));
    }

    async process(endpointstat: number) {

        let sql = `SELECT * FROM checks WHERE endpointId = ${this.endpointId} ORDER BY date DESC LIMIT 0, 10;`
        const [response] = (await db.execute(sql)) as Array<RowDataPacket>
        var allOk = (this.status === 0)
        var prevRespProblem = false
        var allResponsesDown = true
        response.map((resp: Check) => {
            if (resp.status === 1) {
                prevRespProblem = true;
                allOk = false;
            }
            if (resp.status === 0) {
                allResponsesDown = false;
            }
        })
        if (allOk) {
            Endpoint.changeStatus(this.endpointId, 0)
        } else if (allResponsesDown) {
            Endpoint.changeStatus(this.endpointId, 2)
        } else {
            Endpoint.changeStatus(this.endpointId, 1)
        }

        Endpoint.checkEndpoints(this.endpointId)

    }
}

export default Check; 