var express = require("express");
var router = express.Router();

const { signup, login } = require("./controller/userController");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});

router.post("/sign-up", signup);

module.exports = router;
