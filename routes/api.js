/**
 * API for serving JSON to the client.
 */

var bcrypt = require("bcrypt");

var Task = require("../models/task");
var User = require("../models/user");

/**
 * Retrieve the information of the currently logged in user. (GET)
 * @param req The request object
 * @param res The response object; responds with "false" if no user is logged in
 */
exports.getLoggedInUser = function (req, res) {
	if (req.isAuthenticated()) {
		res.send(req.user);
	} else {
		res.send(false);
	}
};

/**
 * Log out of Cascade.
 * @param req The request object
 * @param res The response object
 */
exports.logout = function (req, res) {
	req.logOut();
	res.send(200, {message: "Successfully logged out"});
};

/**
 * Create a new user. (POST)
 * @param req The request object; body should contain all the data of the new user according to the User schema
 * @param res The response object
 */
exports.createUser = function (req, res) {
	var username = req.body.username;
	User.findOne({username: username}, function (err, user) {
		if (user) {
			res.send(409, {message: "Username already taken"});
		} else if (err) {
			res.send(500, {message: "Error while getting user"});
		} else {
			// Salt and hash the password and store the new user in the database.
			bcrypt.hash(req.body.password, 10, function (err, hash) {
				if (err) {
					res.send(500, {message: "Error while generating hash"});
				} else {
					var newUser = new User({
						username: username,
						password: hash,
						dateCreated: req.body.dateCreated,
						tasks: []
					});
					newUser.save(function (err) {
						if (err) {
							res.send(500, {message: "Error while creating user"});
						} else {
							res.send(200, {message: "User created"});
						}
					});
				}
			});
		}
	});
};

/**
 * Retrieve list of all users. (GET)
 * @param req The request object
 * @param res The response object
 */
exports.listUsers = function (req, res) {
	User.find(function (err, users) {
		if (err) {
			res.send(500, {message: "Error while getting list of users"});
		} else {
			res.json(users);
		}
	});
};

/**
 * Delete the user with the given ID. (DELETE)
 * @param req The request object; should include a user ID parameter
 * @param res The response object
 */
exports.deleteUser = function (req, res) {
	var userToDelete = req.params[0];
	User.findOne({id: userToDelete}, function (err, user) {
		if (err) {
			res.send(500, {message: "Error while getting user"});
		} else {
			user.remove(function (err) {
				if (err) {
					res.send(500, {message: "Error while deleting user"});
				} else {
					res.send(200, {message: "User deleted"});
				}
			});
		}
	});
};

/**
 * Create a new task. (POST)
 * @param req The request object; body should contain all the data of the new task according to the Task schema
 * @param res The response object
 */
exports.createTask = function (req, res) {
	var newTask = new Task({
		creator: req.body.creator,
		goal: req.body.goal,
		quantity: req.body.quantity,
		duration: req.body.duration,
		numWeeks: req.body.numWeeks,
		level: req.body.level,
		completedOn: req.body.completedOn,
		dateCreated: req.body.dateCreated
	});
	newTask.save(function (err) {
		if (err) {
			res.send(500, {message: "Error while creating task"});
		} else {
			res.send(200, {message: "Task created"});
		}
	});
};

/**
 * Get list of all tasks. (GET)
 * @param req The request object
 * @param res The response object
 */
exports.listTasks = function (req, res) {
	Task.find({creator: req.user._id}, function (err, tasks) {
		if (err) {
			res.send(500, {message: "Error while getting list of tasks"});
		} else {
			res.json(tasks);
		}
	});
};

/**
 * Delete the task with the given ID. (DELETE)
 * @param req The request object; should include a task ID parameter
 * @param res The response object
 */
exports.deleteTask = function (req, res) {
	var taskToDelete = req.params[0];
	Task.findOne({id: taskToDelete}, function (err, task) {
		if (err) {
			res.send(500, {message: "Error while getting task"});
		} else {
			task.remove(function (err) {
				if (err) {
					res.send(500, {message: "Error while deleting task"});
				} else {
					res.send(200, {message: "Task deleted"});
				}
			});

		}
	});
};
