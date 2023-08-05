const express = require("express");
const controllers = require("../controllers/bootcamps");

const Bootcamp = require("../models/Bootcamp");

// Middlewares
const advancedResults = require("../middlewares/advanceResults");

// Included other resource routers
const courseRouter = require("./courses");
const router = express.Router();

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);
router.route("/radius/:zipcode/:distance").get(controllers.getBootcampInRadius);

router
	.route("/")
	.get(advancedResults(Bootcamp, "courses"), controllers.getAllBootcamps)
	.post(controllers.createBootcamp);

router
	.route("/:id")
	.get(controllers.getBootcamp)
	.put(controllers.updateBootcamp)
	.delete(controllers.deleteBootcamp);

router.route("/:id/photo").put(controllers.bootcampPhotoUpload);

module.exports = router;
