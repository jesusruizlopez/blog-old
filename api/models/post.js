var mongoose = require('mongoose'),
	Schema   = mongoose.Schema;

var postSchema = new Schema({
	title: {type: String},
	text: {type: String},
	user: {type: Schema.Types.Object, ref: 'users'},
	comments: [{type: Schema.Types.Object, ref: 'comments'}],
	date: {type: Date}
});

module.exports = mongoose.model('posts', postSchema);