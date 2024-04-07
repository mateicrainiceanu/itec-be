import { db } from "../config/db"

interface Bug {
    id?: number,
    title: string,
    status: number,
    description: string,
    url: string,
    reportersEmail: string,
    appId: number,
}

class Bug {
    constructor(title: string,
        description: string,
        url: string,
        reportersEmail: string,
        appId: number) {
        this.title = title
        this.status = 0
        this.description = description
        this.url = url
        this.reportersEmail = reportersEmail
        this.appId = appId
    }

    async save() {
        let sql = `INSERT INTO bugs (title, appId, status, description, url, reportersEmail) VALUES (
            '${this.title}',
            ${this.appId},
            ${this.status},
            '${this.description}',
            '${this.url}',
            '${this.reportersEmail}'
        );`

        return db.execute(sql)
    }

    static getForApp(id: number) {
        let sql = `SELECT * FROM bugs WHERE appId = ${id} AND status=0;`;
        return db.execute(sql)
    }
}

export default Bug