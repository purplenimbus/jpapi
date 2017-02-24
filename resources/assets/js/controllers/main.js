'use strict';

/**
 * @ngdoc function
 * @name jpApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jpApp
 */
angular.module('jpApp')
	.controller('MainCtrl', function ($scope,jobs,elements,$rootScope,init,location/*,$state,$auth*/) {
		
		console.log('init',init);	
		console.log('init rootScope',$rootScope);	
				
		$scope.search = {
			title : $rootScope.user.location.location ?  $rootScope.user.location.location : init[1].formatted_address
		};
		
		/*
		$scope.getLocaton = function(){
			var self = this;
			console.log('Get Location');
			if($rootScope.user.location){
				console.log('Root Location Found',$rootScope.user.location);
				$scope.search = {
					title : $rootScope.user.location.location
				};
			}else{
				location.getLocation().then(function(result){
					console.log('Get Location Found',result);
					$scope.search = {
						title : result[1].formatted_address
					};
				});
			}
			
		};
		*/
		
		$scope.data = init;
		
		var autocomplete;
		
		console.log('Search',$scope.search);
		
		var home_loc;
		
		$scope.findjobs = function(search){
			console.log('Search',search);
			/*
			jobs.findJobs($scope.search.place_id,$scope.search.job_id).then(function(result){
				console.log('Result',result);
			});
			*/
		}
		
		console.log('rootScope',$rootScope);
		
		$scope.search = $rootScope.user.location;
		
		//google.maps.event.addDomListener(window, 'load',function(){

			angular.element('#job_title').typeahead(null, {
				name: 'job_title',
				display: 'title',
				source: elements.form.bloodhound('/api/job_titles'),
				hint: true,
				highlight: true,
				minLength: 0,
				limit: 10,
				templates: {
					empty: [
						'<div class="tt-suggestion tt-empty-message collection">',
						'No results were found ...',
						'</div>'
					].join('\n'),
					//header: '<div class="collection-header"><h6>'+name+'</h6></div>'
					//suggestion: Handlebars.compile('<div class="collection-item">{{value}}</div>')
				},
				classNames: {
					selectable: 'collection-item',
					dataset : 'collection'
				},
				//identify: function(obj) { return obj.name; },
			}).bind('typeahead:select', function(ev, suggestion) {
				var asset = angular.element(ev.currentTarget).get(0).dataset.asset;
				console.log('Selection(name): ' + suggestion.name);
				console.log('Selection(id): ' + suggestion.id);
				//console.log('event: ' + asset);
				$scope.search.title = suggestion;
				//$scope.currentAsset[asset].name = suggestion.name;

				//$scope.currentAsset
			});
		//});
		
		console.log('Bloodhound',elements.form.bloodhound('/api/job_titles'));
		
		// Create the autocomplete object, restricting the search to geographical
		// location types.
		autocomplete = new google.maps.places.Autocomplete(
			/** @type {!HTMLInputElement} */(angular.element('input#job_location').get(0)),
			{types: ['geocode']});
			
		autocomplete.addListener('place_changed', function(){
			var place = this.getPlace();
			
			console.log('Place',place);
			
			$scope.search = {};
			
			$scope.search.location = place.formatted_address;
			
			$scope.search.place_id = place.place_id;
			
			console.log('Place Search',$scope.search);
			
		});
	});
