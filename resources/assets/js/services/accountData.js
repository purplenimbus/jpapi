'use strict';

/**
 * @ngdoc function
 * @name jpApp.service:accountData
 * @description
 * # JobsCtrl
 * Service of the jpApp
 */
angular.module('jpApp')
	.service('accountData', function ($q,$http,jobs,$rootScope,location,$auth)
	{
		return {
			user		: null,
			getUserData : function(id){
				return $http.get('/api/profile/'+id+($auth.isAuthenticated() ? '?token='+$auth.getToken() : ''));
			},
			saveData 	:	function(id,data){
				return $http.post('/api/profile/'+id,data);
			},
			getJobs		:	function(id){
				return $http.get('/api/profile/{'+id+'}/jobs');
			},
			/**
			 * Sets the Users Location in the $rootScope
			 */
			setUserLocation : function(){
				
				var deferred = $q.defer();
				if(!$rootScope.user){
					$rootScope.user = {};
				}
				
				//Get Home location of the current user
				if(navigator.geolocation && !$rootScope.user.location) {
					//console.log('Location Needed');
					
					$rootScope.user.location =	{};
					
					return location.getLocation().then(function(result){
						
						//console.log('Location Result',result);
						
						$rootScope.user.location.location = result[1].formatted_address;
							
						$rootScope.user.location.place_id = result[1].place_id;
						
						$rootScope.user.location.lat 	=	result[1].geometry.location.lat();
						
						$rootScope.user.location.lng	=	result[1].geometry.location.lng();
														
						deferred.resolve(result);
						
						return deferred.promise;
						
					});

				}
			}
		};
	});
