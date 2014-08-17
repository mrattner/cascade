var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	dateCreated: {type: Date, default: Date.now}
});

module.exports = mongoose.model("User", userSchema);