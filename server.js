/* env file config */
require("dotenv").config();
require("ejs");

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const APP_PORT = process.env.APP_PORT || 5500;
const app = express();

app.use(express.static(__dirname));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static("resources"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.listen(APP_PORT, () => {
    console.log(`Server listening on port ${APP_PORT}`);
});
