const express = require("express");
const controllers = require("../controllers/bootcamps");

// Included other resource routers
const courseRouter = require("./courses");
const router = express.Router();

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);
router.route("/radius/:zipcode/:distance").get(controllers.getBootcampInRadius);

router
	.route("/")
	.get(controllers.getAllBootcamps)
	.post(controllers.createBootcamp);

router
	.route("/:id")
	.get(controllers.getBootcamp)
	.put(controllers.updateBootcamp)
	.delete(controllers.deleteBootcamp);

module.exports = router;
