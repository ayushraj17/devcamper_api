const express = require("express");
const controllers = require("../controllers/auth");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.route("/register").post(controllers.register);
router.route("/login").post(controllers.login);
router.route("/me").get(protect, controllers.getMe);

module.exports = router;
