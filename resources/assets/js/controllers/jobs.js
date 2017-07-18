'use strict';

/**
 * @ngdoc function
 * @name jpApp.controller:JobsCtrl
 * @description
 * # JobsCtrl
 * Controller of the jpApp
 */
angular.module('jpApp')
	.controller('JobsCtrl', function ($scope,jobs,$routeParams,$route,$location,$compile,$rootScope,jobsData,accountData)
	{
		var JobsCtrl = this;
		
		JobsCtrl.jobs = jobsData;
		
		$scope.showMap = true;
		
		if(!$rootScope.user.location){
			accountData.setUserLocation().then(function(result){
				console.log('setUserLocation',result);
				console.log('User Root Geo',$rootScope.user.location);
				
				var home = new mapboxgl.LngLat(result[1].geometry.location.lng(), result[1].geometry.location.lat());
				
				console.log('User Home Geo',home);
				
				var map = new mapboxgl.Map({
					container: 'map',
					style: 'mapbox://styles/mapbox/streets-v10',
					center: home,
					zoom: 10
				});
								
				// Add geolocate control to the map.
				map.addControl(new mapboxgl.GeolocateControl());
				
				map.on('load', function () {
					angular.forEach(JobsCtrl.jobs,function(value){
						if(value.location){
							var marker = new mapboxgl.Marker()
									  .setLngLat([parseInt(value.location.lng), parseInt(value.location.lat)])
									  .addTo(map);
						}
					});
					
				});
			});
		}
		
	});
