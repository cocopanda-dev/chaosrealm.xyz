const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);
server.listen(3000, () => {
    console.log("Server is running on port 3000");
});

process.on("SIGINT", () => {
    server.close(() => {
        console.log("SIGINT");
        wss.clients.forEach((client) => {
            client.close();
        });
        shutdownDB();
    });
});

/** Begin websocket */
const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({ server: server });

wss.on("connection", (ws) => {
    const numClients = wss.clients.size;
    console.log(`New client connected (total: ${numClients})`);

    wss.broadcast(`CUrrent visitors: ${numClients}`);

    if (ws.readyState === ws.OPEN) {
        ws.send("Welcome to my server");
    }

    db.run(`INSERT INTO visitors (count, time)
        VALUES (${numClients}, datetime('now'))
    `);

    ws.on("close", () => {
        wss.broadcast(`Current visitors: ${numClients}`);
        console.log("A client has dicounnected");
    });
});

wss.broadcast = (data) => {
    wss.clients.forEach((client) => {
        client.send(data);
    });
};
/** End websocket */

/** Begin database */
const sqlite = require("sqlite3");
const db = new sqlite.Database(":memory:");

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS visitors (
            count INTEGER,
            time TEXT
        )
    `);
});

function getCounts() {
    db.each("SELECT * from visitors", (err, row) => {
        console.log(row);
    });
}

function shutdownDB() {
    getCounts();
    console.log("Closing database");
    db.close();
}
