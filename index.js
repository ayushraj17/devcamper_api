const express = require("express");
const dotenv = require("dotenv");
// Routes
const bootcamps = require("./routes/bootcamps");
dotenv.config({ path: "./config/.env" });
const morgan = require("morgan");
const app = express();

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
	console.log(`Server running on PORT ${PORT} in ${process.env.NODE_ENV}`)
);
