const express = require("express");
const router = express.Router();
const controllers = require("../controllers/bootcamps");

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
