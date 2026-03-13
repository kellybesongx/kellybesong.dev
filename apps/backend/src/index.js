const express = require("express");
const app = express();
app.use(express.json());

app.get("/api/v1/health", (req, res) => res.status(200).json({ status: "ok" }));

app.listen(3001, () => console.log("Backend running on port 3001"));
module.exports = app;
