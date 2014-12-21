var mongoose = require('mongoose'),
	Schema   = mongoose.Schema;

var commentSchema = new Schema({
	post: {type: Schema.Types.ObjectId},
	text: {type: String},
	user: {type: Schema.Types.Object, ref: 'users'},
	date: {type: Date}
});

module.exports = mongoose.model('comments', commentSchema);