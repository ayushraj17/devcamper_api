class ErrorResponse extends Error {
	constructor(message, statusCode, fieldError) {
		super(message);
		this.statusCode = statusCode;
		this.fieldError = fieldError;
		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = ErrorResponse;
