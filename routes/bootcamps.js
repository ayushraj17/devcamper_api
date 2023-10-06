const express = require("express");
const controllers = require("../controllers/bootcamps");

const Bootcamp = require("../models/Bootcamp");

// Middlewares
const { protect, authorize } = require("../middlewares/auth");
const advancedResults = require("../middlewares/advanceResults");

// Included other resource routers
const courseRouter = require("./courses");
const router = express.Router();

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);
router
	.route("/radius/:zipcode/:distance")
	.get(protect, controllers.getBootcampInRadius);

router
	.route("/")
	.get(advancedResults(Bootcamp, "courses"), controllers.getAllBootcamps)
	.post(protect, authorize("publisher", "admin"), controllers.createBootcamp);

router
	.route("/:id")
	.get(controllers.getBootcamp)
	.put(protect, authorize("publisher", "admin"), controllers.updateBootcamp)
	.delete(protect, authorize("publisher", "admin"), controllers.deleteBootcamp);

router
	.route("/:id/photo")
	.put(
		protect,
		authorize("publisher", "admin"),
		controllers.bootcampPhotoUpload
	);

module.exports = router;
