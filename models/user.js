var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	dateCreated: {type: Date, default: Date.now},
	tasks: [{type: String, ref: "Task"}]
});

module.exports = mongoose.model("User", userSchema);