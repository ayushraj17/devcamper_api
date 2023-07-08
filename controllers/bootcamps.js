/**
 * @desc Get all bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
exports.getAllBootcamps = (req, res, next) => {
	res.status(200).json({ success: true, message: "Hello" });
};

/**
 * @desc Get single bootcamp
 * @route GET /api/v1/bootcamps
 * @access Public
 */
exports.getBootcamp = (req, res, next) => {
	res.status(200).json({ success: true, message: "Hello" });
};

/**
 * @desc Create bootcamp
 * @route POST /api/v1/bootcamps/
 * @access Private
 */
exports.createBootcamp = (req, res, next) => {
	res.status(201).json({ success: true, message: "Hello" });
};

/**
 * @desc Update a bootcamp
 * @route POST /api/v1/bootcamps/:id
 * @access Private
 */
exports.updateBootcamp = (req, res, next) => {
	res.status(201).json({ success: true, message: "Hello" });
};

/**
 * @desc Delete a bootcamp
 * @route DELETE /api/v1/bootcamps/:id
 * @access Private
 */
exports.deleteBootcamp = (req, res, next) => {
	res.status(200).json({ success: true, message: "Hello" });
};
