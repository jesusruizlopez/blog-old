var PostsModel = require('../models/post.js');
var CommentModel = require('../models/comment.js');

var MESSAGE_ERROR = "Un error ocurrió al intentar recuperar las publicaciones.";

exports.createPost = function(req, res) {
	req.body.date = new Date();
	var post = new PostsModel(req.body);
	post.save(function(err, post) {
		if (err)
			res.send({success: false, message: "Un error ocurrió al intentar crear la publicación."});
		else
			if (post != null)
				res.send({success: true, message: "Post creado con éxito.", post: post})
			else
				res.send({success: false, message: "Un error ocurrió al intentar crear la publicación."});
	});
};

exports.addComment = function(req, res) {
	req.body.date = new Date();
	var comment = new CommentModel(req.body);

	comment.save(function(err, response) {
		if (err)
			res.send({success: false, message: "Un error ocurrió al intentar añadir un comentario."});
		else {
			if (response != null) {
				res.send({success: true, message: "Comentario añadido con éxito.", comment: response});
			}
			else
				res.send({success: false, message: "Un error ocurrió al intentar añadir un comentario."});
		}
	})

};

exports.getPosts = function(req, res) {
	PostsModel.find().populate('user', 'username').sort({date: -1}).exec(function (err, response) {
  		if (err)
			res.send({success: false, message: MESSAGE_ERROR});
		else
			res.send({success: true, posts: response});
	});
};

exports.getPost = function(req, res) {
	PostsModel.findOne({_id: req.query.post_id}).populate('user', 'username').exec(function(err, post) {
		if (err)
			res.send({success: false, message: "Un error ocurrió al intentar recuperar la publicación."});
		else {
			if (post != null) {
				CommentModel.find({post: req.query.post_id}).populate('user', 'username').exec(function(err, response) {
					if (err)
						res.send({success: false, message: "Un error ocurrió al intentar recuperar la publicación."});
					else {
						if (response != null) {
							post.comments = response;
							res.send({success: true, post: post});
						}
						else
							res.send({success: false, message: "Un error ocurrió al intentar recuperar la publicación."});
					}
				});
			}
			else
				res.send({success: false, message: "Un error ocurrió al intentar recuperar la publicación."});
		}
	});
};