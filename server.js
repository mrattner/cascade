// Dependencies
var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// Configuration
var config = require("./config");

// Routes
var routes = require("./routes/index");
var api = require("./routes/api");
var router = express.Router();

router.get("/", routes); // Index page
router.post("/users", api.createUser);
router.get("/users", api.listUsers);
router.delete("/users/:userId", api.deleteUser);
router.post("/tasks", api.createTask);
router.get("/tasks", api.listTasks);
router.delete("/tasks/:taskId", api.deleteTask);

// MongoDB database
mongoose.connect(config.db);
mongoose.connection.on("error", function (err) {
	console.error(err);
});
mongoose.connection.once("open", function() {
	console.log("database open");
});

// Create the app
var app = express();

// Middleware
app.use(favicon(__dirname + "/public/favicon.ico"));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", router);

// Any other route not defined by the Router is a 404 error. Forward to the error handler.
app.use(function(req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// Error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: err
    });
});

module.exports = app;
