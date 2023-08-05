const advancedResults = (model, populate) => async (req, res, next) => {
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
	query = model.find(JSON.parse(queryString));

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
	const total = await model.countDocuments();
	query = query.skip(startIndex).limit(limit);

	// Pagination Result
	const pagination = { perPage: limit };
	if (endIndex < total) {
		pagination.nextPage = page + 1;
	}
	if (startIndex < 0) {
		pagination.previousPage = page - 1;
	}

	if (populate) {
		query = query.populate(populate);
	}
	// Execute query
	const results = await query;

	res.advancedResults = {
		success: true,
		count: results.length,
		...pagination,
		data: results,
	};
	next();
};

module.exports = advancedResults;
