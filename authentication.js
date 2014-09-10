var bcrypt = require("bcrypt-nodejs");
var LocalStrategy = require("passport-local").Strategy;
var User = require("./models/user");

exports.authenticate = new LocalStrategy(function (username, password, done) {
	var incorrectMsg = "Incorrect username or password";
	User.findOne({username: username}, function (err, user) {
		if (err) {
			done(err);
		} else if (!user) {
			// User does not exist
			done(null, false, {message: incorrectMsg});
		} else {
			// Check password
			bcrypt.compare(password, user.password, function (err, valid) {
				if (err) {
					done(err);
				} else if (!valid) {
					// Incorrect password
					done(null, false, {message: incorrectMsg});
				} else {
					// Correct password
					done(null, user);
				}
			});
		}
	});
});

exports.serializeUser = function (user, done) {
	done(null, user.id);
};

exports.deserializeUser = function (id, done) {
	User.findOne({_id: id}, function (err, user) {
		done(err, user);
	});
};