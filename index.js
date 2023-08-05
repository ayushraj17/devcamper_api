const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
// Config
const { connectDB } = require("./config/db");
dotenv.config({ path: "./config/.env" });

// Connect to DB
connectDB();

// Routes
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const { errorHandler } = require("./middlewares/error");
const app = express();

// Body Parser
app.use(express.json());

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);

app.use(errorHandler);
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
	console.log(
		`Server running on PORT ${PORT.bgYellow} in ${process.env.NODE_ENV}`.yellow
			.bold
	)
);

process.on("unhandledRejection", (err, promise) => {
	console.error(`Error : ${err.message}`.red);
	// Close the server & exit process
	server.close(() => process.exit(1));
});
