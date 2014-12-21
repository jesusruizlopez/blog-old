app.controller('LoginController', ['$scope', 'RequestFetcher', 'AuthenticationService', '$location', '$routeParams', function($scope, $request, $auth, $location, $routeParams) {
	
	$scope.user = {username: "", password: ""};

	$scope.login = function(credential) {
		if (credential.username.trim().length <= 0 || credential.password.trim().length <= 0)
			alert("Todos los campos son necesarios.")
		else
			request = $auth.login(credential);
	}
}]);

app.controller('RegisterController', ['$scope', 'RequestFetcher', function($scope, $request) {
	
	$scope.user = {username: "", email: "", password: ""};
	$scope.confirm_password = "";

	$scope.registerAccount = function(credential) {
		var confirm_password = $scope.confirm_password;
		if (credential.username.trim().length <= 0 || credential.email.trim().length <= 0 || credential.password.trim().length <= 0 || confirm_password.trim().length <= 0) {
			alert("Todos los campos son necesarios.");
		}
		else {
			if (credential.password != confirm_password)
				alert("La contraseña no coincide.");
			else {
				var request = $request.registerAccount(credential);
				request.success(function(data, status, headers, config) {
					if (data.success === true) {
						$scope.user = {username: "", email: "", password: ""};
						$scope.confirm_password = "";
					}
					alert(data.message);

				}).
				error(function(data, status, headers, config) {});
			}
		}
	}
}]);

app.controller('HomeController', ['$scope', 'RequestFetcher', 'Socket', function($scope, $request, $socket) {
	$socket.on('connect', function () {
		$socket.on('post', function(data) {
	    	$('#newPosts').removeClass('hide');
	    });
  	});

  	$scope.cargar = function() {
  		$('#newPosts').addClass('hide');
  		var request = $request.getPosts();
		request.success(function(data, status, headers, config) {
			if (data.success !== true) {
				alert(data.message);
			}
			else {
				posts = [];
				data.posts.forEach(function(post) {
					addPost(post, 'get');
				});
			}
		}).
		error(function(data, status, headers, config) {});
  	}

	$scope.posts = [];
	var posts = [];

	var request = $request.getPosts();
	request.success(function(data, status, headers, config) {
		if (data.success !== true) {
			alert(data.message);
		}
		else {
			data.posts.forEach(function(post) {
				addPost(post, 'get');
			});
		}
	}).
	error(function(data, status, headers, config) {});

	$scope.newPost = {title: "", text: "", user: "", date: ""};
	$scope.createPost = function(post) {
		var user = JSON.parse(localStorage.getItem('user'))._id;
		post.user = user;

		if (post.title.trim().length <= 0 || post.text.trim().length <= 0)
			alert("Todos los campos son necesarios.");
		else {
			var request = $request.createPost(post);
			request.success(function(data, status, headers, config) {
				if (data.success === true) {
					$scope.newPost = {title: "", text: "", user: "", date: ""};
					addPost(data.post, 'new');
				}
				else
					alert(data.message);
			}).
			error(function(data, status, headers, config) {});
		}
	};

	function addPost(post, type) {
		date = new Date(post.date);

		var month = monthWithName(date.getMonth());

		if (type == 'new') {
			var user = JSON.parse(localStorage.getItem('user')).username;
			post.user = user;
			post.date = "Creado recientemente."
		}
		else {
			post.user = post.user.username;
			post.date = date.getDate()+ ' de '+month.toLowerCase()+' de '+date.getFullYear();
		}

		post.text = post.text.substring(0, 150);
		post.text += " ...";
		
		
		if (type == 'new') {
			posts.unshift(post);
			$socket.emit('post', post);
		}
		else
			posts.push(post);

		$scope.posts = posts;
	}
}]);

app.controller('PostController', ['$scope', 'RequestFetcher', '$routeParams', '$location', 'Socket', function($scope, $request, $routeParams, $location, $socket) {
	
	$scope.post = {title: "", text: "", user: "", date: ""};
	$scope.comments = [];
	var comments = [];

	var request = $request.getPost($routeParams.post_id);
	request.success(function(data, status, headers, config) {
		if (data.success === true) {
			data.post.user = data.post.user.username;

			date = new Date(data.post.date);

			var month = monthWithName(date.getMonth());

			data.post.date = date.getDate()+ ' de '+month.toLowerCase()+' de '+date.getFullYear();
			$scope.post = data.post;	
			
			$scope.post.comments.forEach(function(comment) {
				addComment(comment, 'get');
			});
		}
		else {
			$location.path('/');
		}
	}).
	error(function(data, status, headers, config) {});

	$scope.comment = {post: "", text: "", user: "", date: ""};

	$scope.addComment = function(comment) {
		if (comment.text.trim().length <= 0)
			alert("Todos los campos son necesarios.");
		else {
			comment.post = $routeParams.post_id;
			
			var user = JSON.parse(localStorage.getItem('user'))._id;
			comment.user = user;
			
			var request = $request.addComment(comment);
			request.success(function(data, status, headers, config) {
				if (data.success === true) {
					$scope.comment = {post: "", text: "", user: "", date: ""};
					addComment(data.comment, 'new');
				}
				else
					alert(data.message);
			}).
			error(function(data, status, headers, config) {});
		}
	};

	function addComment(comment, type) {

		if (type == 'new') {
			var user = JSON.parse(localStorage.getItem('user')).username;
			comment.user = user;
		}
		else {
			comment.user = comment.user.username;
		}
		
		date = new Date(comment.date);
			month = monthWithName(date.getMonth());
			comment.date = date.getDate()+ ' de '+month.toLowerCase()+' de '+date.getFullYear();
		
		comments.push(comment);

		$scope.comments = comments;
	}
}]);

monthWithName = function(month_id) {
	var month = ""
	switch (month_id) {
		case 0: month = "Enero";
			break;
		case 1: month = "Febrero";
			break;
		case 2: month = "Marzo";
			break;
		case 3: month = "Abril";
			break;
		case 4: month = "Mayo";
			break;
		case 5: month = "Junio";
			break;
		case 6: month = "Julio";
			break;
		case 7: month = "Agosto";
			break;
		case 8: month = "Septiembre";
			break;
		case 9: month = "Octubre";
			break;
		case 10: month = "Noviembre";
			break;
		case 11: month = "Diciembre";
			break;
	}
	return month;
}