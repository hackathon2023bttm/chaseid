const express = require("express");

const app = express();

app.get("/", (req, res) => {
    console.log("GET /");
    res.json({ message: "/" });
});

app.get("/ping", (req, res) => {
    console.log("GET /ping");
    res.end();
});

app.get("/hello", (req, res) => {
    console.log("GET /hello");
    res.json({ message: "hello" });
});

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log("Listening on port " + listener.address().port);
});

