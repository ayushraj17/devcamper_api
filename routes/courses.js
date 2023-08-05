const express = require("express");
const controllers = require("../controllers/courses");

const router = express.Router({ mergeParams: true });

router.route("/").get(controllers.getCourse).post(controllers.addCourse);
router
	.route("/:id")
	.get(controllers.getCourses)
	.put(controllers.updateCourse)
	.delete(controllers.deleteCourse);

module.exports = router;
