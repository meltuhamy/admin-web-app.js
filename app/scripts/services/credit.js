'use strict';

angular.module('adminPanelApp')
	.factory('Credit', function($http, $q, Book, Format, ROUTES) {

		return {
			get: function(id) {
				var defer = $q.defer();
				$http({
					method: 'GET',
					url: ROUTES.ADMIN_USERS + '/' + id + ROUTES.CREDIT,
					headers: {
						'Cache-Control': 'no-cache, no-store, must-revalidate',
						'Pragma': 'no-cache',
						'Expires': 0,
						'X-Requested-With': 'XMLHttpRequest'
					}
				}).then(function(response){
						defer.resolve(Format.credit(response.data));
					}, defer.reject);
				return defer.promise;
			}
		};

	}
);