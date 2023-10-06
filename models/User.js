const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please enter a name"],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	role: {
		type: String,
		enum: ["user", "publisher"],
		default: "user",
	},
	email: {
		type: String,
		unique: true,
		required: [true, "Please enter an email"],
		match: [
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
			"Please add a valid email",
		],
	},
	password: {
		type: String,
		required: [true, "Please enter a password"],
		minlength: 6,
		select: false,
	},
});

// Encrypt password using bcrypt
const SALT_ROUNDS = 10;
UserSchema.pre("save", async function (next) {
	const salt = bcrypt.genSaltSync(SALT_ROUNDS);
	this.password = bcrypt.hashSync(this.password, salt);
	next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};

// Match password
UserSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
