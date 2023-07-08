const express = require("express");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/.env" });
const app = express();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
	console.log(`Server running on PORT ${PORT} in ${process.env.NODE_ENV}`)
);
