'use strict';

/**
 * @ngdoc service
 * @name jpApp.location
 * @description
 * # location
 * Service in the jpApp.
 */
angular.module('jpApp')
	.service('location', function ($q) {
		// AngularJS will instantiate a singleton by calling "new" on this function
		return{
			/**
			 * Returns a $http.get promise to get the current users location
			 * @param {object} $data - The data for the GET request
			 * @param {integer} $id - The id for the GET request
			 * @returns {Promise}
			 */
			getLocation	:	function(){
				var deferred = $q.defer(),
					self = this;
				
				navigator.geolocation.getCurrentPosition(function(pos){
					console.log('App Pos',pos);
					//$rootScope.user.location.geo = {lat: , lng: };
					self.geoCoder(pos.coords.latitude,pos.coords.longitude).then(function(result){
						deferred.resolve(result)
					}).catch(function(error){
						//To Do Logging Service 
						console.error(error);
						deferred.reject(error);
					});
				});
				
				return deferred.promise;
			},
			/**
			 * Returns a $http.get promise to get the curent users location
			 * @param {object} $data - The data for the GET request
			 * @param {integer} $id - The id for the GET request
			 * @returns {Promise}
			 */
			geoCoder : function(lat,lng){
				var geo = new google.maps.Geocoder,
					deferred = $q.defer();
		
				geo.geocode({'location': {lat: lat, lng: lng}}, function(result, status) {
					console.log('Geo Coder Result',result,status);
					if(result.length >= 1){
						deferred.resolve(result);
					}else{
						deferred.reject(result);
					}
				});
				
				return deferred.promise;
			}
		};
	});
