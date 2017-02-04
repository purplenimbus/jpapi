'use strict';

/**
 * @ngdoc function
 * @name jpApp.controller:JobsCtrl
 * @description
 * # JobsCtrl
 * Controller of the jpApp
 */
angular.module('jpApp')
	.controller('JobCtrl', function ($scope,jobs,$route,$location,$filter,modal,elements,$rootScope,form)
	{
		this.awesomeThings = [
		  'HTML5 Boilerplate',
		  'AngularJS',
		  'Karma'
		];
		
		$rootScope.$location.title = '';
		
		angular.element('.progress').show();
		
		var autocomplete,self = this;
		
		this.data = {};
		
		console.log($route);
		
		$scope.init = function(){
			jobs.getData('jobs',$route.current.params.jobId).then(function(result){
				$scope.currentAsset = result.data;
				//$scope.currentAsset.application_deadline = result.data.application_deadline ? new Date(result.data.application_deadline) : result.data.application_deadline;
				console.log('Date',result.data.application_deadline);
				$scope.cache = $scope.currentAsset;
				$scope.currentAsset.pay = {};
				console.log('Got a job',$scope.currentAsset);
				$scope.currentAsset.application_deadline ? 
					$scope.currentAsset.application_deadline = new Date($scope.currentAsset.application_deadline)
					: null;
				$rootScope.$location.title = $scope.currentAsset.title;
				angular.element('.progress').hide();
			});
		};
		
		if(!$scope.currentAsset){
			$scope.init();
		}
		
		$scope.jobOptions = function(options) {
			switch(options){
				case 'job_status' :  return function(){
					var selected = $filter('filter')($rootScope.job.options.job_status, {value: $scope.currentAsset.status});
					return ($scope.currentAsset.status && selected.length) ? selected[0].text : 'Not set';
				}
				break;
			}
		};
		
		$scope.updateJob = function(){			
			
			console.log('Scope Data',$scope.currentAsset);
			
			this.data	=	{
				id : $scope.currentAsset.id,
				title : $scope.currentAsset.title,
				description : $scope.currentAsset.description,
				company_id : $scope.currentAsset.company.id,
				job_category_id : $scope.currentAsset.job_category.id,
				job_type_id : $scope.currentAsset.job_type.id,
				job_level_id : $scope.currentAsset.job_level.id,
				//job_salary_id : $scope.currentAsset.salary_type.id,
				application_deadline : $scope.currentAsset.application_deadline,
				salary : $scope.currentAsset.salary,
				status : $scope.currentAsset.status,
				min_experience : $scope.currentAsset.min_experience,
				min_qualification : $scope.currentAsset.min_qualification.name,
			}
			
			if($scope.currentAsset.location){
				this.data.location = {
					name : $scope.currentAsset.location.name,
					locality : $scope.currentAsset.location.neighborhood ? $scope.currentAsset.location.neighborhood.long_name : $scope.currentAsset.location.vicinity,
					city	:	$scope.currentAsset.location.locality.long_name,
					city_code	:	$scope.currentAsset.location.locality.long_name,
					state	:	$scope.currentAsset.location.administrative_area_level_1.long_name ? $scope.currentAsset.location.administrative_area_level_1.long_name : '',
					state_code	:	$scope.currentAsset.location.administrative_area_level_1.short_name ? $scope.currentAsset.location.administrative_area_level_1.short_name : '',
					country	:	$scope.currentAsset.location.country.long_name ? $scope.currentAsset.location.country.long_name : '',
					country_code	: $scope.currentAsset.location.country.short_name ? $scope.currentAsset.location.country.short_name : '',
					lng	:	$scope.currentAsset.location.geo.lng,
					lat	:	$scope.currentAsset.location.geo.lat,
					ref_id	:	$scope.currentAsset.location.place_id,
					url	:	$scope.currentAsset.location.geo.url,
					zip_code : $scope.currentAsset.location.zipcode ? $scope.currentAsset.location.zipcode : ''
				}
			}
			
			console.log('Data',this.data);
			
			jobs.sendData('jobs',$route.current.params.jobId,this.data).then(function(result){
				console.log('Got a Response',result);
				$scope.cancel();
				////$scope.currentAsset = result.data;
			});
			
		}
		
		$scope.cancel = function(){
			console.log('Edit Cancelled');
			angular.element('#modal').modal('close');
			//angular.element('#job_location').val('');
			//angular.element('#modal form').get(0).reset();
			//$scope.currentAsset = $scope.cache;
			$route.reload();
			$scope.init();
		}
		
		$scope.edit = function(){
			var modalType	=	'bottom-sheet',
				modalTitle	=	'',
				modalBody	=	'',
				modalFooter	=	'';
			
			modalTitle	+=	'<h4 class="left">Edit Job</h4>';
			modalTitle	+=	'<div class="right">'+elements.form.check({name : 'status' , model:'currentAsset.status',colSize: 12,label1:'draft',label2:'published'})+'</div>';
			
			modalFooter	+=	elements.button({	type	:	'button',	cls:	'btn  red accent-4',	ngClick	:	'cancel()'	, label : 'Cancel'});
			modalFooter	+=	elements.button({	type	:	'submit',	cls:	'btn',	ngClick	:	'updateJob()'	, label : 'Save'});
			
			modalBody	=	form.editJob();
			
			modal.modal(modalType,modalTitle,modalBody,modalFooter,$scope).then(function(result){
				angular.element('select').material_select();
				
				CKEDITOR.editorConfig	=	function( config ){
					config.toolbar	=	[
						{name:'clipboard',items:['Cut','Copy','Paste','PasteText','Undo','Redo']},
						{name:'paragraph',items:['NumberedList','BulletedList']}
					];
				};
				
				CKEDITOR.replace( 'job_description' ).on( 'change', function( evt ) {
					$scope.currentAsset.description = evt.editor.getData();
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
				
				angular.element('.chips-autocomplete').on('chip.add', function(e, chip){
					$scope.currentAsset.required_skills = angular.element(this).material_chip('data');
				}).on('chip.delete', function(e, chip){
					$scope.currentAsset.required_skills = angular.element(this).material_chip('data');
				});
					
				console.log(elements.form.bloodhound('/job_skills').index.datums);
				
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
					
					$scope.currentAsset.location = {};
					
					$scope.currentAsset.location.name = place.formatted_address;//place.name ? place.name : '';
					
					place.address_components.map(function(value,key){
						console.log('Value',value);
						$scope.currentAsset.location[value.types[0]] = {};
						$scope.currentAsset.location[value.types[0]].long_name = value.long_name ? value.long_name : '';
						$scope.currentAsset.location[value.types[0]].short_name = value.short_name ? value.short_name : '';
					});
					$scope.currentAsset.location.place_id = place.place_id ? place.place_id : '';
					$scope.currentAsset.location.vicinity = place.vicinity ? place.vicinity : '';
						
					//Set location long lat
					$scope.currentAsset.location.geo = { 
															lng : place.geometry.location.lng(), 
															lat	: place.geometry.location.lat(),
															url : place.url
														};
					//Set url
					console.log('Location Asset',$scope.currentAsset.location);
				});
				
				var slider = angular.element('#pay').get(0);
				//console.log('Salary',parseInt($scope.currentAsset.salary.split(',')[0].toString().replace(/$$|.000/g,'')));				
				//console.log('Salary Scope',$scope);				
				
				noUiSlider.create(slider, {
					start: $scope.currentAsset.salary ? [parseInt($scope.currentAsset.salary.split(',')[0].toString().replace(/$$|.000/g,'')), 
							parseInt($scope.currentAsset.salary.split(',')[1].toString().replace(/$$|.000/g,''))] : [0,100],
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
						postfix: '.000',
					})
				});
				
				slider.noUiSlider.on('update', function(value,handle){
					console.log('Slider Changed',value.toString());
					$scope.currentAsset.pay.value  = value;
					$scope.currentAsset.salary  = value.toString();
					$scope.currentAsset.pay.min = value[0];
					angular.element('.range-field span.min').html(value[0]);
					$scope.currentAsset.pay.max  = value[1];
					angular.element('.range-field span.max').html(value[1]);
				});
				
				
				angular.element('.datepicker').pickadate({
					selectMonths: true, // Creates a dropdown to control month
				}).on('change',function(e){
					$scope.currentAsset.application_deadline = new Date(angular.element(e.currentTarget).val());
				});
				
				//Initalize Typeahead
				angular.element('.typeahead').each(function(key,value){
					
					var name = angular.element(value).get(0).name;
										
					angular.element('#'+name).typeahead(null, {
						name: name,
						display: 'name',
						source: elements.form.bloodhound('/'+name).ttAdapter(),
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
						$scope.currentAsset[asset] = suggestion;
						//$scope.currentAsset[asset].name = suggestion.name;
						
						console.log('Scope asset(id): ' + $scope.currentAsset[asset].id);
						console.log('Scope asset(name): ' + $scope.currentAsset[asset].name);
						//$scope.currentAsset
					});
				});
				
				console.log('Check current asset',$scope.currentAsset.status === 1);
				
				$scope.currentAsset.status === 1 ? angular.element('#status').get(0).checked = true : null;
				
			});
		}
		
	});
