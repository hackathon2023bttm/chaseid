const express = require("express");

const app = express();

app.get("/ping", (req, res) => {
    res.end();
});

app.get("/hello", (req, res) => {
    res.json({ message: "hello" });
});

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log("Listening on port " + listener.address().port);
});

