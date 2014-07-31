var express = require("express");
var router = express.Router();

/**
 * When the route is '/', serve the index page.
 */
router.get("/", function(req, res) {
  res.sendfile("./public/index.html");
});

module.exports = router;
