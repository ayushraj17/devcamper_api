const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
	let error = {
		// For some reason known only to robots, message is undefined when spreading
		message: err.message,
		...err,
	};

	// Log error to console
	console.error(error, "og");

	// Mongoose had bad ObjectId
	if (err.name === "CastError") {
		const message = `Resource not found with id ${err.value}`;
		error = new ErrorResponse(message, 404);
	}

	// Mongoose had bad ObjectId
	if (err.code === 11000) {
		const message = `Duplicate field(s) entered: ${Object.keys(
			err.keyValue
		).join(", ")}`;
		const fieldError = err.keyValue;
		for (key in err.keyValue) {
			fieldError[key] = `${key} already exists`;
		}
		error = new ErrorResponse(message, 400, fieldError);
	}
	if (err.name === "ValidationError") {
		const message = "Validation Error(s)";
		const fieldError = {};
		for (key in err.errors) {
			fieldError[key] = err.errors[key].message;
		}
		error = new ErrorResponse(message, 400, fieldError);
	}

	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || "Something went wrong",
		fieldError: error.fieldError,
	});
};
module.exports = {
	errorHandler,
};
