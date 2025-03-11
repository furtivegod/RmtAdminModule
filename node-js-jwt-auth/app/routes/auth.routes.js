const controller = require("../controllers/auth.controller");
const app = require("express");

module.exports = function() {
  const router = app.Router();
  router.post("/signin", controller.signin);
  return router
};
