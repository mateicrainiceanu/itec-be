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

    async save(){
        let sql = `INSERT INTO checks (endpointId, status, code) VALUES (
            ${this.endpointId}, 
            ${this.status},
            ${this.code}
        );`

        return (db.execute(sql));
    }

    async process(endpointstat: number){
        if ((this.status !== 0 || endpointstat !== 0)){
            let sql = `SELECT * FROM checks WHERE endpointId = ${this.endpointId} ORDER BY date DESC LIMIT 0, 10;`
            const [response] = (await db.execute(sql)) as Array<RowDataPacket>
            var prevRespProblem = 0
            response.map((resp: Check) => {
                if (resp.status === 1){
                    prevRespProblem = 1;
                }
            })
            if (!prevRespProblem) {
                Endpoint.changeStatus(this.endpointId, 0)
            } else if (prevRespProblem && endpointstat === 0) {
                Endpoint.changeStatus(this.endpointId, 1)
            }
        }
    } 
}

export default Check; 