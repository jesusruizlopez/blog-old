app.directive('buttonLogout', ['AuthenticationService', 'HttpRequestTracker', function($auth, $tracker) {
	return {
		restrict: 'A', // A = Attribute, C = Class Name, E = Element, M = HTML Comment
		link: function(scope, element, attrs) {
			scope.isLoged = function() {
				if (localStorage.getItem('auth') != "true")
					return false;
				return true;
			}
			scope.logout = function() {
				$auth.logout();
			}
			scope.hasPendingRequests = function () {
    			return $tracker.hasPendingRequests();
  			}
		}
	}
}]);