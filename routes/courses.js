const express = require("express");
const controllers = require("../controllers/courses");

const Course = require("../models/Course");

// Middlewares
const { protect, authorize } = require("../middlewares/auth");
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
	.post(protect, authorize("publisher", "admin"), controllers.addCourse);
router
	.route("/:id")
	.get(controllers.getCourse)
	.put(protect, authorize("publisher", "admin"), controllers.updateCourse)
	.delete(protect, authorize("publisher", "admin"), controllers.deleteCourse);

module.exports = router;
