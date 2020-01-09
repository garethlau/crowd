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


// remove resource from favourites
router.delete("/fav", (req, res) => {
	if (!req.user) {
	  return res.status(401).send();
	}
	const resourceId = req.query.resourceId;
	if (!resourceId) {
	  return res.status(400).send();
	}
	User.findById(req.user._id, (err, user) => {
	  if (err) {
		return res.status(404).send();
	  }
	  if (!user) {
		// shouldn't happen
		return res.status(404).send();
	  }
	  // find index of favourited resource
	  let index = user.favs ? user.favs.indexOf(resourceId) : -1;
	  if (index != -1) {
		user.favs.splice(index, 1);
		user
		  .save()
		  .then(() => {
			return res
			  .status(200)
			  .send({ message: "Removed resource from favourites." });
		  })
		  .catch(err => {
			console.log(err);
			return res.status(500).send();
		  });
	  }
	});
  });
  
  // favourite resource
  router.post("/fav", (req, res) => {
	if (!req.user) {
	  return res.status(401).send();
	}
	const resourceId = req.body.resourceId;
	if (!resourceId) {
	  return res.status(400).send();
	}
	User.findById(req.user._id, (err, user) => {
	  if (err) {
		return res.status(404).send();
	  }
	  if (!user) {
		// this shouldn't happen
		return res.status(500).send();
	  }
	  user.favs.push(resourceId);
	  user
		.save()
		.then(savedUser => {
		  return res.status(200).send({ message: "Added to favourites." });
		})
		.catch(err => {
		  console.log(err);
		  return res.status(500).send();
		});
	});
  });

// get user data
router.get("/current", (req, res) => {
	res.status(200).send({ user: req.user });
});

// login
router.post("/login", (req, res, next) => {
	passport.authenticate("local-login", (err, user, info) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			console.log("no user", info);
			if (info.message == "Incorrect password.") {
				return res.status(400).send({message: info.message});
			}
			// user was not found
			return res.status(404).send({ message: info.message });
		} else {
			req.login(user, err => {
				if (err) return next(err);
				return res.status(200).send({ user: user, message: info.message });
			});
		}
	})(req, res, next);
});

// logout
router.get("/logout", (req, res) => {
	req.logout(); // passport session handles logout
	req.session.destroy(); // destroy the session
	res.status(200).send("Logged out.");
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
			if (info.message == "Email already being used.") {
				// a user with the same email already exists
				res.status(409).send({ message: info.message });
			}
			else {
				// Error saving the user
				res.status(500).send({message: info.message});
			}
		} else {
			req.login(user, err => {
				if (err) return next(err);
				console.log("user after login in signup", user);
				res.status(200).send({ user: user, message: info.message });
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
				res.status(500).send({ message: "There was an error." });
			}
			if (!user) {
				console.log("Password token is invalid or expired.");
				res.status(401).send({ message: "Invalid token" });
			} else {
				user.isVerified = true;
				user.createAccountToken = "";
				user.createAccountExpires = "";
				user.save()
					.then(savedUser => {
						console.log("User verified.");
						res.status(200).send({ message: "User verified." });
					})
					.catch(err => {
						console.log("There was an error.");
						res.status(500).send({ message: "There was an error." });
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
			res.status(404).send({ message: "No user specified email." });
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
					res.status(200).send({
						message:
							"Please check your email for a link to reset your password."
					});
				})
				.catch(err => {
					console.log(err);
					res.status(500).send({
						message: "There was an error sending the reset email."
					});
				});
		});
	}).catch(err => {
		console.log("Error saving", err);
		res.status(500).send({ message: "Error saving." });
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
				res.status(500).send({ message: "There was an error" });
			}
			if (!user) {
				console.log("No user or invalid token");
				res.status(401).send({ message: "Invalid or expired token." });
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
								res.status(200).send({ message: "Password changed." });
							})
							.catch(err => {
								console.log("There was an sending the email.");
								res.status(500).send({
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
