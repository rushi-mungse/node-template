/* env file config */
require("dotenv").config();
require("ejs");

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const routes = require("./routes");

const APP_PORT = process.env.APP_PORT || 5500;
const app = express();

app.use(express.static(__dirname));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static("resources"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(routes);

app.listen(APP_PORT, () => {
    console.log(`Server listening on port ${APP_PORT}`);
});
