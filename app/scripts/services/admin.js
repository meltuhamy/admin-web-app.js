'use strict';

angular.module('adminPanelApp')
	.factory('Admin', function($http, $q, Credit, Format, ROUTES) {
		return {
			search: function(data) {
				return $http({
					method: 'GET',
					url: ROUTES.ADMIN_USERS,
					params: data,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'X-Requested-With': 'XMLHttpRequest'
					}
				});
			},
			get: function(id){
				var defer = $q.defer();
				if(!!id){
					$http({
						method: 'GET',
						url: ROUTES.ADMIN_USERS + '/' + id,
						headers: {
							'X-Requested-With': 'XMLHttpRequest'
						}
					}).then(function(response){
							Credit.get(id).then(function(credit){
								var user = Format.user(response.data);
								if(!!credit){
									user.credit = credit;
								}
								defer.resolve(user);
							}, defer.reject);
						}, defer.reject);
				} else {
					defer.reject('The admin service requires an id of the user to retrieve');
				}
				return defer.promise;
			}
		};
	}
);