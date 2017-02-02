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
			
			this.data	=	{
				id : $scope.currentAsset.id,
				title : $scope.currentAsset.title,
				description : $scope.currentAsset.description,
				company_id : $scope.currentAsset.company.id,
				job_category_id : $scope.currentAsset.job_category.id,
				job_type_id : $scope.currentAsset.job_type.id,
				job_level_id : $scope.currentAsset.job_level.id,
				application_deadline : $scope.currentAsset.application_deadline,
				salary : $scope.currentAsset.salary,
				status : $scope.currentAsset.status,
				min_experience : $scope.currentAsset.min_experience,
				min_qualification : $scope.currentAsset.min_qualification.name,
			}
			
			console.log('Data',this.data);
			/*
			jobs.sendData('jobs',$route.current.params.jobId,this.data).then(function(result){
				console.log('Got a Response',result);
				$scope.cancel();
				////$scope.currentAsset = result.data;
			});
			*/
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
			modalTitle	+=	'<div class="right">'+elements.form.check({name : 'status' , model:'currentAsset.status',colSize: 12,label1:'Draft',label2:'Published'})+'</div>';
			
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
				
				angular.element('.chips-initial').on('chip.add', function(e, chip){
					$scope.currentAsset.required_skills = angular.element(this).material_chip('data');
				}).on('chip.delete', function(e, chip){
					$scope.currentAsset.required_skills = angular.element(this).material_chip('data');
				}).material_chip({
					placeholder: 'Skills',
					data: $scope.currentAsset.required_skills
				});
				
				// Create the autocomplete object, restricting the search to geographical
				// location types.
				autocomplete = new google.maps.places.Autocomplete(
					/** @type {!HTMLInputElement} */(angular.element('input#job_location').get(0)),
					{types: ['geocode']});

				// When the user selects an address from the dropdown, populate the address
				// fields in the form.
				autocomplete.addListener('place_changed', function(){
					var place = this.getPlace();
					
					//console.log('Place',place);
					
					$scope.currentAsset.location.name = place.name ? place.name : '';
					
					place.address_components.map(function(value,key){
						//console.log('Value',value);
						$scope.currentAsset.location[value.types[0]] = {};
						$scope.currentAsset.location[value.types[0]].long_name = value.long_name ? value.long_name : '';
						$scope.currentAsset.location[value.types[0]].short_name = value.short_name ? value.short_name : '';
					});
				});
				
				var slider = angular.element('#pay').get(0);
				
				noUiSlider.create(slider, {
					start: [0, 100],
					connect: true,
					step: 5,
					range: {
						'min': 0,
						'max': 1000
					},
					format: wNumb({
						decimals: 0,
						thousand: '.',
						prefix: '$',
						postfix: ',000',
					})
				});
				
				slider.noUiSlider.on('update', function(value,handle){
					//console.log('Slider Changed',value);
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
						templates: {
							empty: [
								'<div class="tt-suggestion tt-empty-message collection">',
								'No results were found ...',
								'</div>'
							].join('\n'),
							//suggestion:'<div class="collection-item">{{value}}</div>'
						},
						classNames: {
							selectable: 'collection-item',
							dataset : 'collection'
						}
					}).bind('typeahead:change', function(ev, suggestion) {
						console.log('Selection: ' + suggestion);
						console.log('event: ' + ev);
						//$scope.currentAsset
					});
					
				});

			});
		}
		
	});
