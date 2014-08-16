/**
 * Render the login/signup page.
 * @param req The request object
 * @param res The response object
 */
exports.display = function (req, res) {
  res.sendfile("./public/index.html");
};