const express = require("express");
const app = express();
require('dotenv').config()
const db = require("./database/db");
db();
const cors = require('cors')

app.use(cors({
    origin: process.env.front_link,
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", require("./router/auth"));
app.use("/api", require("./router/hos_details"));
app.use("/api", require("./router/rooms"));
app.use("/api", require("./router/students"));
app.use("/api", require("./router/complaints"));
app.use("/api", require("./router/fees"));
app.use("/api", require("./router/review"));
app.use("/api", require("./router/guideline"));


app.listen(8000, () => {
    console.log("Server is running on port 8000");
})