const express = require("express");
const controllers = require("../controllers/courses");

const Course = require("../models/Course");

// Middlewares
const advancedResults = require("../middlewares/advanceResults");

const router = express.Router({ mergeParams: true });

router
	.route("/")
	.get(
		advancedResults(Course, {
			path: "bootcamp",
			select: "name description",
		}),
		controllers.getCourses
	)
	.post(controllers.addCourse);
router
	.route("/:id")
	.get(controllers.getCourse)
	.put(controllers.updateCourse)
	.delete(controllers.deleteCourse);

module.exports = router;
