const router = require("express").Router();

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

module.exports = router;
