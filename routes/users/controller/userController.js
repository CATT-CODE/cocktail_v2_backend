const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const User = require("../model/User");

module.exports = {
	signup: async (req, res) => {
		try {
			let salted = await bcrypt.genSalt(10);
			let hashedPassword = await bcrypt.hash(req.body.password, salted);

			let createdUser = new User({
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				email: req.body.email,
				password: hashedPassword,
			});

			let savedUser = await createdUser.save();

			res.json({
				payload: savedUser,
			});
		} catch (e) {
			res.status(500).json({
				message: e.message,
			});
		}
	},
	login: async (req, res) => {
		try {
			let foundUser = await User.findOne({ email: req.body.email });
			if (!foundUser) {
				throw { message: "Email not registered" };
			}

			let comparePassword = await bcrypt.compare(
				req.body.password,
				foundUser.password
			);
			if (!comparePassword) {
				throw { message: "Check email or password" };
			} else {
				let jwtToken = jwt.sign(
					{ email: foundUser.email },
					process.env.JWT_VERY_SECRET,
					{ expiresIn: "1hr" }
				);
				res.json({
					jwtToken: jwtToken,
				});
			}
		} catch (e) {
			res.status(500).json({
				message: e.message,
			});
		}
	},
	sendSMSTwilio: async (req, res) => {
		try {
			let sentSMS = await client.messages.create({
				body: `Here's a cocktail recipe to try - \n\n${req.body.ctName}: \n\nhttp://localhost:3000/recipe-detail/${req.body.ctID}`,
				from: "+17408411029",
				to: `+1${req.body.toggleInput}`,
			});
		} catch (e) {
			res.status(500).json({
				message: e.message,
			});
		}
	},
};
