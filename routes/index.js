const router = require("express").Router();
const Compiler = require("../controllers/Compiler");
const SendEmail = require("../controllers/SendEmail");

router.get("/", (req, res) => {
    return res.render("pages/home");
});

router.get("/login", (req, res) => {
    return res.render("pages/login");
});

router.get("/workflows", (req, res) => {
    return res.render("pages/workflows");
});

router.get("/workpace", (req, res) => {
    return res.render("pages/workspace");
});

router.post("/api/compiler", Compiler.compileCode);

router.post("/api/send-email", SendEmail.sendEmail);

module.exports = router;
