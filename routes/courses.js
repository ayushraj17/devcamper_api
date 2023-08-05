const express = require("express");
const controllers = require("../controllers/courses");

const router = express.Router({ mergeParams: true });

router.route("/").get(controllers.getCourse);

module.exports = router;
