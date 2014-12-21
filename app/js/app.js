var app = angular.module('app', ['ngRoute']).config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: 'templates/login.html',
		controller: 'LoginController'
	}).
	when('/register', {
		templateUrl: 'templates/register.html',
		controller: 'RegisterController'
	}).
	when('/home', {
		templateUrl: 'templates/home.html',
		controller: 'HomeController'
	}).
	when('/post/:post_id', {
		templateUrl: 'templates/post.html',
		controller: 'PostController'
	}).
	otherwise({
		redirectTo: '/'
	});
});

app.run(function($rootScope, $location, AuthenticationService) {
	$rootScope.$on('$routeChangeStart', function(event, next, current) {
		if ($location.path() != '/register') {
			if ($location.path() != '/' && !AuthenticationService.isLoged())
				$location.path('/');
			else if ($location.path() == '/' && AuthenticationService.isLoged())
				$location.path('/home');
		}
	});
});