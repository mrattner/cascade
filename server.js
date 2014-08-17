// Dependencies
var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var session = require("express-session");
var mongooseSession = require("mongoose-session");

var auth = require("./authentication");
var config = require("./config");

var api = require("./routes/api");
var index = require("./routes/index");

////////////////////////// Routes ////////////////////////////////
var router = express.Router();

// Middleware function for checking authentication
function checkAuth (req, res, next) {
	if (!req.isAuthenticated()) {
		res.send(401, {message: "Not logged in"});
	} else {
		next();
	}
}

// Authentication
passport.use(auth.authenticate);
passport.serializeUser(auth.serializeUser);
passport.deserializeUser(auth.deserializeUser);

// Public routes
router.get("/", index.display);
router.post("/users", api.createUser);
router.get("/loggedin", api.getLoggedInUser);
router.post("/logout", api.logout);
router.post("/login", passport.authenticate("local", {successRedirect: "/", failureRedirect: "/"}));

// Protected routes
router.get("/users", checkAuth, api.listUsers);
router.delete("/users/:userId", checkAuth, api.deleteUser);
router.post("/tasks", checkAuth, api.createTask);
router.put("/tasks/:taskId", checkAuth, api.updateTask);
router.get("/tasks", checkAuth, api.listTasks);
router.delete("/tasks/:taskId", checkAuth, api.deleteTask);

//////////////////////// Database //////////////////////////////
mongoose.connect(config.db);
mongoose.connection.on("error", function (err) {
	console.error(err);
});
mongoose.connection.once("open", function() {
	console.log("database open");
});

////////////// Create and configure the app ////////////////////
var app = express();

// Middleware
app.use(favicon(__dirname + "/public/favicon.ico"));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser(config.secret));
app.use(session({
	secret: config.secret,
	resave: true,
	saveUninitialized: true,
	store: mongooseSession(mongoose)
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", router);

// Any other route not defined by the Router is a 404 error.
app.use(function(req, res) {
	res.send(404, {message: "The page you're looking for doesn't exist."});
});

// Error handler
app.use(function(err, req, res) {
	var status = err.status || 500;
	var message = err.message || "Something went wrong!";
	res.send(status, {message: message});
});

module.exports = app;
