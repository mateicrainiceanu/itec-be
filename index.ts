import { RowDataPacket } from "mysql2";
import app, { port } from "./config/app";
import Endpoint from "./models/Endpoint";
import Check from "./models/Checks";
import axios from "axios";
import { response } from "express";


//ROUTES & LOGIC

app.get("/", (req, res) => {
    res.send("Hello from express from typescript");
});



async function runCheck() {
    console.log("running");
    const [results] = (await Endpoint.getEndpoints()) as Array<RowDataPacket>
    // console.log(results);
    results.map(async (endpoint: Endpoint) => {
        var status = 404;
        await axios.get(endpoint.url).then(response => {
            console.log(response.status);
            status = response.status

        }).catch(error => {})


        const newCk = new Check(endpoint.id, status)

        newCk.process(endpoint.status)

        newCk.save()

    })
}

app.listen(port, () => {
    setInterval(runCheck, 1000)
    console.log("App started on port " + port);
})