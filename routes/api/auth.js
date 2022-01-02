const express = require("express");
const config = require("config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const User = require("../../models/User");

const router = express.Router();

//@route    POST api/auth
//@desc     Login user
//@access   Public
router.get("/", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		res.json(user);
	} catch (err) {
		console.error(err);
		return res.status(500).send("Server Error");
	}
});

//@route    POST api/auth
//@desc     Authenticate User And Get Token
//@access   Public
router.post(
	"/",
	[
		check("email", "Please include a valid email").isEmail(),
		check("password", "Password is required").exists(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password } = req.body;

		try {
			//See if user exists
			let user = await User.findOne({ email });

			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: "Invalid Credentials" }] });
			}

			const isMatched = await bcrypt.compare(password, user.password);

			if (!isMatched) {
				return res
					.status(400)
					.json({ errors: [{ msg: "Invalid Credentials" }] });
			}

			const payload = {
				user: {
					id: user.id,
				},
			};

			jwt.sign(
				payload,
				config.get("jwtSecret"),
				{
					expiresIn: 3600000,
				},
				(err, token) => {
					if (err) {
						throw err;
					}
					res.json({ token });
				}
			);

			//Return jsonwebtoken
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server Error");
		}
	}
);


module.exports = router;
