const asyncHandler = require("../middlewares/asyncHandler");
const Course = require("../models/Course");
const ErrorResponse = require("../utils/errorResponse");

/**
 * @desc Get courses
 * @route GET /api/v1/courses
 * @router GET /api/v1/bootcamps/:bootcampId/courses
 * @access Public
 */

exports.getCourse = asyncHandler(async (req, res, next) => {
	let query;
	console.log(req.params);
	if (req.params.bootcampId) {
		query = Course.find({ bootcamp: req.params.bootcampId });
	} else [(query = Course.find())];
	const courses = await query;
	res.status(200).json({
		success: true,
		count: courses.length,
		data: courses,
	});
});
