const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const crypto = require("crypto");
const keys = require("../config/keys");
const mailjet = require("node-mailjet").connect(
	keys.mailjetKey,
	keys.mailjetSecret
);

// get user data
router.get("/current", (req, res) => {
	res.send({ user: req.user });
});

// login
router.post("/login", (req, res, next) => {
	passport.authenticate("local-login", (err, user, info) => {
		if (err) return next(err);
		if (!user) {
			res.send({ message: info.message });
		} else {
			req.login(user, err => {
				if (err) return next(err);
				res.send({ user: user, message: info.message });
			});
		}
	})(req, res, next);
});

// logout
router.get("/logout", (req, res) => {
	req.logout(); // passport session handles logout
	req.session.destroy(); // destroy the session
	res.send("Logged out.");
});

// sign up
router.post("/signup", (req, res, next) => {
	console.log(req.body);
	console.log("CREATE NEW USER");
	passport.authenticate("local-signup", (err, user, info) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			// a user with the same email already exists
			res.send({ message: info.message });
		} else {
			req.login(user, err => {
				if (err) return next(err);
				console.log("user after login in signup", user);
				res.send({ user: user, message: info.message });
			});
		}
	})(req, res, next);
});

// sign up with (with token)
router.get("/signup/:token", (req, res) => {
	console.log("sign up w/ token", req.params.token);
	const token = req.params.token;
	User.findOne(
		{
			createAccountToken: token,
			createAccountExpires: { $gt: Date.now() }
		},
		(err, user) => {
			if (err) {
				console.log("There was an err", err);
				res.send({ message: "There was an error." });
			}
			if (!user) {
				console.log("Password token is invalid or expired.");
				res.send({ message: "Invalid token" });
			} else {
				user.isVerified = true;
				user.createAccountToken = "";
				user.createAccountExpires = "";
				user.save()
					.then(savedUser => {
						console.log("User verified.");
						res.send({ message: "User verified." });
					})
					.catch(err => {
						console.log("There was an error.");
						res.send({ message: "There was an error." });
					});
			}
		}
	);
});

// reset password
router.post("/reset-password", (req, res) => {
	let email = req.body.email;
	console.log("reset email is ", email);
	User.findOne({ email: email }, (err, user) => {
		if (err || user == null) {
			res.send({ message: "No user specified email." });
			return;
		}
		// generate token
		const buf = crypto.randomBytes(256);
		const token = buf.toString("hex");
		// save token to db
		user.resetPasswordToken = token;
		user.resetPasswordExpires = Date.now() + 1 * 60 * 60 * 1000;
		user.save().then(savedUser => {
			// send email
			const tokenUrl =
				"http://localhost:5000/api/v1/user/reset-password/" + token;
			// extract the token on client side and submit the token with the new password to the reset password with token endpoint.
			const htmlContent = `Follow this link to reset your password: http://localhost:3000/reset/${tokenUrl}`;
			const request = mailjet.post("send", { version: "v3.1" }).request({
				Messages: [
					{
						From: {
							Email: "Gareth.kh.lau@gmail.com",
							Name: "Gareth"
						},
						To: [
							{
								Email: email,
								Name: firstName
							}
						],
						Subject: "Reset your passwod",
						TextPart: "hello",
						HTMLPart: htmlContent,
						CustomID: "nice"
					}
				]
			});
			request
				.then(result => {
					console.log(result.body);
					res.send({
						message:
							"Please check your email for a link to reset your password."
					});
				})
				.catch(err => {
					console.log(err);
					res.send({
						message: "There was an error sending the reset email."
					});
				});
		});
	}).catch(err => {
		console.log("Error saving", err);
		res.send({ message: "Error saving." });
	});
});

// reset password (with token)
router.get("/reset-password/:token", (req, res) => {
	const token = req.body.token;
	const newPassword = req.body.newPassword;
	User.findOne(
		{
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: Date.now() }
		},
		(err, user) => {
			if (err) {
				console.log(err);
				res.send({ message: "There was an error" });
			}
			if (!user) {
				console.log("No user or invalid token");
				res.send({ message: "Invalid or expired token." });
			} else {
				user.password = User().generateHash(newPassword);
				user.resetPasswordToken = "";
				user.resetPasswordExpires = "";
				user.save()
					.then(savedUser => {
						const request = mailjet.post("send").request({
							Messages: [
								{
									From: {
										Email: "Gareth.kh.lau@gmail.com",
										Name: "Gareth"
									},
									To: [
										{
											Email: email,
											Name: firstName
										}
									],
									Subject: "Reset your passwod",
									TextPart: "hello",
									HTMLPart: htmlContent,
									CustomID: "nice"
								}
							]
						});
						request
							.then(result => {
								console.log(result);
								res.send({ message: "Password changed." });
							})
							.catch(err => {
								console.log("There was an sending the email.");
								res.send({
									message:
										"There was an error sending the email."
								});
							});
					})
					.catch(err => {
						console.log("err sending mailjet", err);
						res.send({
							message: "There was an error saving the user."
						});
					});
			}
		}
	);
});

module.exports = router;
