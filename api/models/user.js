var mongoose = require('mongoose'),
	Schema   = mongoose.Schema;

var usersSchema = new Schema({
	username: {
		type: String,
		unique: true
	},
	email: {
		type: String,
		unique: true
	},
	password: {type: String}
});

module.exports = mongoose.model('users', usersSchema);