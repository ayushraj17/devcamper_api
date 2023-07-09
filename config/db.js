const mongoose = require("mongoose");

const connectDB = async () => {
	const res = await mongoose.connect(process.env.MONGO_URI);

	console.log(`MongoDB Connected: ${res.connection.host}`.cyan.underline.bold);
};

module.exports = {
	connectDB,
};
