const asyncHandler = require("../middlewares/asyncHandler");
const bootcamp = require("../models/bootcamp");
const Bootcamp = require("../models/bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");

/**
 * @desc Get all bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
exports.getAllBootcamps = asyncHandler(async (req, res, next) => {
	let query;

	// Copy req.query
	let reqQuery = { ...req.query };

	// Fields to be excluded
	const removeFields = ["select", "sort", "limit", "page"];

	// Exclude fields
	removeFields.forEach((item) => delete reqQuery[item]);

	// Create queryString
	let queryString = JSON.stringify(reqQuery);

	/**
	 * b stands for word boundary
	 * Create operators $gt,$gte,$lt,$lte,$in
	 */
	queryString = queryString.replace(
		/\b(gt|gte|lt|lte|in)\b/g,
		(match) => `$${match}`
	);

	// Finding Resource
	query = Bootcamp.find(JSON.parse(queryString));

	// Select fields
	if (req.query.select) {
		const fields = req.query.select.split(",").join(" ");
		query = query.select(fields);
	}

	// Sort fields
	if (req.query.sort) {
		const sortBy = req.query.sort.split(",").join(" ");
		query = query.sort(sortBy);
	} else {
		query = query.sort("-createdAt");
	}
	// Pagination
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 10;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await Bootcamp.countDocuments();
	query = query.skip(startIndex).limit(limit);

	// Pagination Result
	const pagination = { perPage: limit };
	if (endIndex < total) {
		pagination.nextPage = page + 1;
	}
	if (startIndex < 0) {
		pagination.previousPage = page - 1;
	}

	// Execute query
	const bootcamps = await query;
	res
		.status(200)
		.json({
			success: true,
			count: bootcamps.length,
			data: bootcamps,
			...pagination,
		});
});

/**
 * @desc Get single bootcamp
 * @route GET /api/v1/bootcamps/:id
 * @access Public
 */
exports.getBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);
	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}
	res.status(200).json({ success: true, data: bootcamp });
});

/**
 * @desc Create bootcamp
 * @route POST /api/v1/bootcamps/
 * @access Private
 */
exports.createBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.create(req.body);
	if (bootcamp) {
		res.status(201).json({ success: true, data: bootcamp });
	} else {
		res.status(400).json({ success: false });
	}
});

/**
 * @desc Update a bootcamp
 * @route POST /api/v1/bootcamps/:id
 * @access Private
 */
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
		runValidators: true,
		new: true,
	});
	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}
	res.status(200).json({ success: true, data: bootcamp });
});

/**
 * @desc Delete a bootcamp
 * @route DELETE /api/v1/bootcamps/:id
 * @access Private
 */
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}
	res.status(200).json({ success: true, data: bootcamp });
});

/**
 * @desc Get single bootcamp
 * @route GET /api/v1/bootcamps/:id
 * @access Public
 */
exports.getBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);
	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}
	res.status(200).json({ success: true, data: bootcamp });
});

/**
 * @desc Get bootcamps within a radius
 * @route GET /api/v1/bootcamps/radius/:zipcode/:distance
 * @access Private
 */
exports.getBootcampInRadius = asyncHandler(async (req, res, next) => {
	const { zipcode, distance } = req.params;

	// Get lang/lang  from geocoder
	const loc = await geocoder.geocode(zipcode);
	const { longitude, latitude } = loc[0];
	/**
	 * Calculate radius using radians
	 * Divider distance by radius of Earth
	 * Earth Radius = 3,963 mi/ 6,378 km
	 */
	const radius = distance / 3963;
	const bootcamps = await Bootcamp.find({
		location: {
			$geoWithin: { $centerSphere: [[longitude, latitude], radius] },
		},
	});
	res
		.status(200)
		.json({ success: true, data: bootcamps, count: bootcamps.length });
});
