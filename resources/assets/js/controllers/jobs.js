'use strict';

/**
 * @ngdoc function
 * @name jpApp.controller:JobsCtrl
 * @description
 * # JobsCtrl
 * Controller of the jpApp
 */
angular.module('jpApp')
	.controller('JobsCtrl', function ($scope,jobs,$routeParams,$route,$location,$compile,$rootScope,jobsData,accountData,mapSettings)
	{
		var JobsCtrl = this;
		
		JobsCtrl.jobs = jobsData;
		
		$scope.showMap = true;
		
		if(!$rootScope.user.location){
			accountData.setUserLocation().then(function(result){
				//console.log('setUserLocation',result);
				//console.log('User Root Geo',$rootScope.user.location);
				
				$scope.home = new mapboxgl.LngLat(result[1].geometry.location.lng(), result[1].geometry.location.lat());
				
				$scope.mapStyle = mapSettings().styleUrl;
				
				var features = [];
				
				$scope.$on('mapboxglMap:load', function (angularEvent, mapboxglEvent) {
				   	console.log('Map Loaded',angularEvent,mapboxglEvent);
				});
				
				   var map = new mapboxgl.Map({
						container: 'map',
						//style: 'mapbox://styles/purplenimbus/cj59voeq26auw2snweqgxunkf',
						center: $scope.home,
						zoom: 10
					});
					
					console.log('mapSettings map',map);
					console.log('mapSettings scope',$scope);
				
				//console.log('mapSettings mapboxgl',mapboxgl.Map());
				
				var glPopups = {
					coordinates: $scope.home,
					message: 'HEEEEELLLOOO',
					options: {}, // Optional --> https://www.mapbox.com/mapbox-gl-js/api/#Popup
					getScope: Function, // Default $rootScope
					onClose: function (event, popupClosed) {
					  // ...
					}
				};
				
				/*angular.forEach(JobsCtrl.jobs,function(value){
					if(value.location){
						features.push({
							"type": "Feature",
							"properties": {
								"description": value.description,
								"icon": "theatre"
							},
							"geometry": {
								"type": "Point",
								"coordinates": [parseFloat(value.location.lng), parseFloat(value.location.lat)]
							}
						});
					}
				});
				
				console.log('Jobs features',features);
				
				$scope.glControls = {
				   navigation: {
					  enabled: true | false,
					  options: {} // Navigation control options --> https://www.mapbox.com/mapbox-gl-js/api/#Navigation
				   },
				   scale: {
					  enabled: true | false,
					  options: {} // Scale control options --> https://www.mapbox.com/mapbox-gl-js/api/#Scale
				   },
				   attribution: {
					  enabled: true | false,
					  options: {} // Attribution control options --> https://www.mapbox.com/mapbox-gl-js/api/#Attribution
				   },
				   geolocate: {
					  enabled: true | false,
					  options: {} // Geolocate control options --> https://www.mapbox.com/mapbox-gl-js/api/#Geolocate
				   },
				   geocoder: {
					  enabled: true | false,
					  options: {} // Geocoder control options --> https://github.com/mapbox/mapbox-gl-geocoder/blob/master/API.md
				   },
				   directions: {
					  enabled: true | false,
					  options: {} // Directions control options --> https://github.com/mapbox/mapbox-gl-directions/blob/master/API.md#mapboxgldirections
				   },
				   draw: {
					  enabled: true | false,
					  options: {} // Draw control options -> https://github.com/mapbox/mapbox-gl-draw/blob/master/API.md#options
				   }
				};
				
				$scope.$on('mapboxglMap:load', function (angularEvent, mapboxglEvent) {
				   console.log('Map Loaded',angularEvent,mapboxglEvent);
				});
				/*map.on('load', function () {
					map.addLayer({
						"id": "places",
						"type": "symbol",
						"source": {
							"type": "geojson",
							"data": {
								"type": "FeatureCollection",
								"features": features
							}
						},
						"layout": {
							"icon-image": "{icon}-15",
							"icon-allow-overlap": true
						}
					});
					
					 // When a click event occurs on a feature in the places layer, open a popup at the
					// location of the feature, with description HTML from its properties.
					map.on('click', 'places', function (e) {
						new mapboxgl.Popup()
							.setLngLat(e.features[0].geometry.coordinates)
							.setHTML(e.features[0].properties.description)
							.addTo(map);
					});

					// Change the cursor to a pointer when the mouse is over the places layer.
					map.on('mouseenter', 'places', function () {
						map.getCanvas().style.cursor = 'pointer';
					});

					// Change it back to a pointer when it leaves.
					map.on('mouseleave', 'places', function () {
						map.getCanvas().style.cursor = '';
					});
	
				});*/
			});
		}
		
	});
