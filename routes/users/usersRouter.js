var express = require("express");
var router = express.Router();

const { signup, login, sendSMSTwilio } = require("./controller/userController");
const { checkIsUserHaveValidJwtToken } = require('./lib/authCheck');

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});

router.post("/sign-up", signup);

router.post("/login", login);

router.post("/send-sms-message",
	checkIsUserHaveValidJwtToken,
	sendSMSTwilio);

module.exports = router;