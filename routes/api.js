/**
 * API for serving JSON to the client.
 */

var Task = require("../models/task");

/**
 * Create a new task. (POST)
 * @param req The request object; body should contain all the data of the new task according to the Task schema
 * @param res The response object
 */
exports.createTask = function (req, res) {
	var newTask = new Task({
		goal: req.body.goal,
		quantity: req.body.quantity,
		duration: req.body.duration,
		deadline: req.body.deadline,
		level: req.body.level,
		lastCompleted: req.body.lastCompleted,
		dateCreated: req.body.dateCreated
	});
	newTask.save();
	res.send(200, {message: ""});
};

/**
 * Get list of all tasks. (GET)
 * @param req The request object
 * @param res The response object
 */
exports.listTasks = function (req, res) {
	Task.find(function (err, tasks) {
		if (err) {
			res.send(500);
		} else {
			res.json(tasks);
		}
	});
};

/**
 * Delete the task with the given ID.
 * @param req The request object; should include a task ID parameter
 * @param res The response object
 */
exports.deleteTask = function (req, res) {
	var taskToDelete = req.params[0];
	Task.findOne({id: taskToDelete}, function (err, task) {
		if (err) {
			res.send(500);
		} else {
			task.remove();
			res.send(200);
		}
	});
};
