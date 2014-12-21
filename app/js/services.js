app.factory('AuthenticationService', ['$http', '$location', 'RequestFetcher', function($http, $location, $request) {
	return {
		login: function(credential) {
			request = $request.login(credential);
			request.success(function(data, status, headers, config) {
				if (data.success !== true)
					alert(data.message);
				else {
					localStorage.setItem('auth', true);
					localStorage.setItem('user', JSON.stringify(data.user));
					$location.path('/home')
				}
			}).
			error(function(data, status, headers, config) {});
		},
		isLoged: function() {
			if (localStorage.getItem('auth') != "true")
				return false;
			return true;
		},
		logout: function() {
			localStorage.removeItem('auth');
			localStorage.removeItem('user');
			$location.path('/');
		}
	}
}]);

app.factory('RequestFetcher', function($http, $location) {
	var APIURL = 'http://127.0.0.1:3000/';
	var APIKEY = '61965cce7314a88f5dd94e40b2c1b1f351e47c45';
	var Auth = {Auth: APIKEY};

	return {
		registerAccount: function(credential) {
			return $http({method: 'POST', url: APIURL+'registerAccount', data: credential, headers: Auth});
		},
		login: function(credential) {
			return $http({method: 'POST', url: APIURL+'login', data: credential, headers: Auth});
		},
		createPost: function(post) {
			return $http({method: 'POST', url: APIURL+'createPost', data: post, headers: Auth});
		},
		getPosts: function() {
			return $http({method: 'GET', url: APIURL+'getPosts', headers: Auth});
		},
		getPost: function(post_id) {
			return $http({method: 'GET', url: APIURL+'getPost', params: {post_id: post_id}, headers: Auth});
		},
		addComment: function(comment) {
			return $http({method: 'POST', url: APIURL+'addComment', data: comment, headers: Auth});	
		}
	}
});

app.factory('HttpRequestTracker', ['$http', function($http) {
  var httpRequestTracker = {};
  httpRequestTracker.hasPendingRequests = function() {
    return $http.pendingRequests.length > 0;
  };
  return httpRequestTracker;
}]);

app.factory('Socket', function($rootScope) {
  var socket = io.connect('http://127.0.0.1:7777');
  return {
	on: function (eventName, callback) {
	  socket.on(eventName, function() {  
	    var args = arguments;
	    $rootScope.$apply(function() {
	      callback.apply(socket, args);
	    });
	  });
	},
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});