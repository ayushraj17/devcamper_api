const asyncHandler = require("../middlewares/asyncHandler");
const bootcamp = require("../models/Bootcamp");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");
const path = require("path");
/**
 * @desc Get all bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
exports.getAllBootcamps = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
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
	const bootcamp = await Bootcamp.findOneAndDelete({ _id: req.params.id });
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

/**
 * @desc Update photo for bootcamp
 * @route POST /api/v1/bootcamps/:id/photo
 * @access Private
 */
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);
	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}
	if (!req.files) {
		return next(new ErrorResponse(`Please upload a file`, 404));
	}
	const file = req.files.file;
	if (!file.mimetype.startsWith("image")) {
		return next(new ErrorResponse(`Please upload an image file`, 400));
	}

	// Check file size
	if (file.size > process.env.MAX_FILE_UPLOAD) {
		return next(
			new ErrorResponse(
				`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
				400
			)
		);
	}
	// Create custom file name
	file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
		if (err) {
			console.error(err);
			return next(new ErrorResponse(`Problem with file upload`, 500));
		}

		await Bootcamp.updateOne({ _id: req.params.id }, { photo: file.name });
		res.status(200).json({ success: true, data: file.name });
	});
});
