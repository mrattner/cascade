var mongoose = require("mongoose");

var taskSchema = new mongoose.Schema({
	goal: String,
	quantity: Number,
	duration: {
		amount: Number,
		time: String
	},
	deadline: {
		amount: Number,
		time: String
	},
	level: Number,
	lastCompleted: Date,
	dateCreated: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Task", taskSchema);