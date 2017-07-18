'use strict';

/**
 * @ngdoc function
 * @name jpApp.controller:JobCtrl
 * @description
 * # JobCtrl
 * Controller of the jpApp
 */
angular.module('jpApp')
	.controller('JobCtrl', function ($scope,jobs,$route,$location,$filter,modal,elements,$rootScope,form,jobData,accountData)
	{
		
		var JobCtrl = this;
		
		$rootScope.$location.title = '';
		
		var autocomplete;
		
		JobCtrl.data = {};
		
		console.log('jobData',jobData);
		
		$scope.currentAsset = JobCtrl.currentAsset = jobData;
		
		JobCtrl.cache = JobCtrl.currentAsset;//Make a copy of the currentAsset
		
		JobCtrl.currentAsset.pay = {}; //Initalize pay object
		
		console.log('Got a job',JobCtrl.currentAsset);
		
		//Parse Date for HTML 5 date element
		JobCtrl.currentAsset.application_deadline ? 
			JobCtrl.currentAsset.application_deadline = new Date(JobCtrl.currentAsset.application_deadline)
			: null;
			
		$rootScope.$location.title = JobCtrl.currentAsset.title;
		
		JobCtrl.jobOptions = function(options) {
			switch(options){
				case 'job_status' :  return function(){
					var selected = $filter('filter')($rootScope.job.options.job_status, {value: JobCtrl.currentAsset.status});
					return (JobCtrl.currentAsset.status && selected.length) ? selected[0].text : 'Not set';
				}
				break;
			}
		};
		
		$scope.showMap = true;
		
		if(!$rootScope.user.location){
			accountData.setUserLocation().then(function(result){
				console.log('setUserLocation',result);
				console.log('User Root Geo',$rootScope.user.location);
				
				var home = new mapboxgl.LngLat(result[1].geometry.location.lng(), result[1].geometry.location.lat());
				
				console.log('User Home Geo',home);
				
				var map = new mapboxgl.Map({
					container: 'map',
					style: 'mapbox://styles/purplenimbus/cj59u1c0r69x52sl0qejv56mm',
					center: home,
					zoom: 10
				});
								
				// Add geolocate control to the map.
				map.addControl(new mapboxgl.GeolocateControl());
				
				map.on('load', function () {
					if(JobCtrl.currentAsset.location){
						var marker = new mapboxgl.Marker()
					  .setLngLat([parseInt(JobCtrl.currentAsset.location.lng), parseInt(JobCtrl.currentAsset.location.lat)])
					  .addTo(map);
					}					
				});
			});
		}		
		/**
		 * Update Job
		 */
		$scope.updateJob = function(){			
			
			console.log('Scope Data',JobCtrl.currentAsset);
			
			JobCtrl.data	=	{
				id : JobCtrl.currentAsset.id,
				title : JobCtrl.currentAsset.title,
				description : JobCtrl.currentAsset.description,
				//company_id : JobCtrl.currentAsset.company ? JobCtrl.currentAsset.company.id : null,
				job_category_id : JobCtrl.currentAsset.job_category.id,
				job_type_id : JobCtrl.currentAsset.job_type.id,
				job_level_id : JobCtrl.currentAsset.job_level.id,
				job_salary_id : $scope.currentAsset.salary_type ? $scope.currentAsset.salary_type.id : null,
				application_deadline : JobCtrl.currentAsset.application_deadline ? JobCtrl.currentAsset.application_deadline : null,
				salary : JobCtrl.currentAsset.salary,
				status : JobCtrl.currentAsset.status,
				min_experience : JobCtrl.currentAsset.min_experience,
				min_qualification : JobCtrl.currentAsset.min_qualification.name,
			}
			
			JobCtrl.currentAsset.location = {}; //Temp work around for testing
			
			if(JobCtrl.currentAsset.location.searched){
				JobCtrl.data.location = {
					name : JobCtrl.currentAsset.location.name,
					locality : JobCtrl.currentAsset.location.neighborhood ? JobCtrl.currentAsset.location.neighborhood.long_name : JobCtrl.currentAsset.location.vicinity,
					city	:	JobCtrl.currentAsset.location.locality.long_name,
					city_code	:	JobCtrl.currentAsset.location.locality.long_name,
					state	:	JobCtrl.currentAsset.location.administrative_area_level_1.long_name ? JobCtrl.currentAsset.location.administrative_area_level_1.long_name : '',
					state_code	:	JobCtrl.currentAsset.location.administrative_area_level_1.short_name ? JobCtrl.currentAsset.location.administrative_area_level_1.short_name : '',
					country	:	JobCtrl.currentAsset.location.country.long_name ? JobCtrl.currentAsset.location.country.long_name : '',
					country_code	: JobCtrl.currentAsset.location.country.short_name ? JobCtrl.currentAsset.location.country.short_name : '',
					lng	:	JobCtrl.currentAsset.location.geo.lng,
					lat	:	JobCtrl.currentAsset.location.geo.lat,
					ref_id	:	JobCtrl.currentAsset.location.place_id,
					url	:	JobCtrl.currentAsset.location.geo.url,
					zip_code : JobCtrl.currentAsset.location.zipcode ? JobCtrl.currentAsset.location.zipcode : ''
				}
			}
			
			console.log('Data',JobCtrl.data);
			
			jobs.sendData('jobs',$route.current.params.jobId,JobCtrl.data).then(function(result){
				console.log('Got a Response',result);
				JobCtrl.reset();
			});
			
		}
		/**
		 * Reset Page
		 */
		JobCtrl.reset = function(){
			console.log('Edit Cancelled');
			angular.element('#modal').modal('close');
			//angular.element('#job_location').val('');
			//angular.element('#modal form').get(0).reset();
			//$scope.currentAsset = $scope.cache;
			$route.reload();
		}
		
		/**
		 * Edit Job
		 */
		$scope.edit = function(){
			var modalType	=	'bottom-sheet',
				modalTitle	=	'',
				modalBody	=	'',
				modalFooter	=	'';
			
			modalTitle	+=	'<h4 class="left">Edit Job</h4>';
			modalTitle	+=	'<div class="right">'+elements.form.check({name : 'status' , model:'currentAsset.status',colSize: 12,label1:'draft',label2:'published'})+'</div>';
			
			modalFooter	+=	elements.button({	type	:	'button',	cls:	'btn  red accent-4',	ngClick	:	'reset()'	, label : 'Cancel'});
			modalFooter	+=	elements.button({	type	:	'submit',	cls:	'btn',	ngClick	:	'updateJob()'	, label : 'Save'});
			
			modalBody	=	form.editJob();
			
			modal.modal(modalType,modalTitle,modalBody,modalFooter,$scope).then(function(result){
				angular.element('select').material_select();
				//Input elements need to converted to directives
				CKEDITOR.editorConfig	=	function( config ){
					config.toolbar	=	[
						{name:'clipboard',items:['Cut','Copy','Paste','PasteText','Undo','Redo']},
						{name:'paragraph',items:['NumberedList','BulletedList']}
					];
				};
				
				CKEDITOR.replace( 'job_description' ).on( 'change', function( evt ) {
					JobCtrl.currentAsset.description = evt.editor.getData();
				});
				
				angular.element('.chips-autocomplete').material_chip();
				
				angular.element('.chips-autocomplete').material_chip({
					placeholder: 'Skills',
					autocompleteData: {
					  'Apple': null,
					  'Microsoft': null,
					  'Google': null
					}
				});
				
				//angular.element("#required_skills").tagit();
				
				angular.element('.chips-autocomplete').on('chip.add', function(e, chip){
					JobCtrl.currentAsset.required_skills = angular.element(this).material_chip('data');
				}).on('chip.delete', function(e, chip){
					JobCtrl.currentAsset.required_skills = angular.element(this).material_chip('data');
				});
					
				console.log(elements.form.bloodhound('/api/job_skills').index.datums);
				
				// Create the autocomplete object, restricting the search to geographical
				// location types.
				autocomplete = new google.maps.places.Autocomplete(
					/** @type {!HTMLInputElement} */(angular.element('input#job_location').get(0)),
					{types: ['geocode']});

				// When the user selects an address from the dropdown, populate the address
				// fields in the form.
				autocomplete.addListener('place_changed', function(){
					var place = this.getPlace();
					
					console.log('Place',place);
					//console.log('Place Long',place.geometry.location.lng());
					
					JobCtrl.currentAsset.location = { searched : true };
					
					JobCtrl.currentAsset.location.name = place.formatted_address;//place.name ? place.name : '';
					
					place.address_components.map(function(value,key){
						console.log('Value',value);
						JobCtrl.currentAsset.location[value.types[0]] = {};
						JobCtrl.currentAsset.location[value.types[0]].long_name = value.long_name ? value.long_name : '';
						JobCtrl.currentAsset.location[value.types[0]].short_name = value.short_name ? value.short_name : '';
					});
					JobCtrl.currentAsset.location.place_id = place.place_id ? place.place_id : '';
					JobCtrl.currentAsset.location.vicinity = place.vicinity ? place.vicinity : '';
						
					//Set location long lat
					JobCtrl.currentAsset.location.geo = { 
															lng : place.geometry.location.lng(), 
															lat	: place.geometry.location.lat(),
															url : place.url
														};
					//Set url
					console.log('Location Asset',JobCtrl.currentAsset.location);
				});
				
				var slider = angular.element('#pay').get(0);
				//console.log('Salary',parseInt($scope.currentAsset.salary.split(',')[0].toString().replace(/$$|.000/g,'')));				
				//console.log('Salary Scope',$scope);				
				
				noUiSlider.create(slider, {
					start: JobCtrl.currentAsset.salary ? [parseInt(JobCtrl.currentAsset.salary.split(',')[0].toString().replace(/$$|.000/g,'')), 
							parseInt(JobCtrl.currentAsset.salary.split(',')[1].toString().replace(/$$|.000/g,''))] : [0,100],
					connect: true,
					step: 5,
					range: {
						'min': 0,
						'max': 1000
					},
					format: wNumb({
						decimals: 0,
						thousand: '.',
						//prefix: '$',
						postfix: '.000'
					})
				});
				
				slider.noUiSlider.on('update', function(value,handle){
					console.log('Slider Changed',value.toString());
					JobCtrl.currentAsset.pay.value  = value;
					JobCtrl.currentAsset.salary  = value.toString();
					JobCtrl.currentAsset.pay.min = value[0];
					angular.element('.range-field span.min').html(value[0]);
					JobCtrl.currentAsset.pay.max  = value[1];
					angular.element('.range-field span.max').html(value[1]);
				});
				
				
				angular.element('.datepicker').pickadate({
					selectMonths: true, // Creates a dropdown to control month
				}).on('change',function(e){
					JobCtrl.currentAsset.application_deadline = new Date(angular.element(e.currentTarget).val());
				});
				
				
				//Initalize Typeahead
				angular.element('.typeahead').each(function(key,value){
					
					var name = angular.element(value).get(0).name;
										
					angular.element('#'+name).typeahead(null, {
						name: name,
						display: 'name',
						source: elements.form.bloodhound('/api/'+name).ttAdapter(),
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
						//console.log('Selection(name): ' + suggestion.name);
						//console.log('Selection(id): ' + suggestion.id);
						//console.log('event: ' + asset);
						JobCtrl.currentAsset[asset] = suggestion;
						//$scope.currentAsset[asset].name = suggestion.name;
						
						console.log('Scope asset(id): ' + JobCtrl.currentAsset[asset].id);
						console.log('Scope asset(name): ' + JobCtrl.currentAsset[asset].name);
						//$scope.currentAsset
					});
				});
				
				console.log('Check current asset',JobCtrl.currentAsset.status === 1);
				
				JobCtrl.currentAsset.status === 1 ? angular.element('#status').get(0).checked = true : null;
				
			});
		}
		/**
		 * Apply to Job
		 * @param {integer} id  - The name of the PUT/POST endpoint
		 */
		$scope.apply	=	function(id){
			console.log('Job Id',id);
			jobs.sendData('jobs',id+'/apply').then(function(result){
				console.log('Application Result',result);
				JobCtrl.reset();
			}).catch(function(error){
				console.log('Application Error',error);
				//TO DO  DO something
			});
		}
	});
