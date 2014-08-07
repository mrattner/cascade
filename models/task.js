var mongoose = require("mongoose");

var taskSchema = new mongoose.Schema({
	goal: String,
	category: String,
	quantity: Number,
	duration: {
		amount: Number,
		time: String
	},
	numWeeks: Number,
	level: Number,
	completedOn: [Date],
	dateCreated: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Task", taskSchema);