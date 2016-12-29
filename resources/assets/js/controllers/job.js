'use strict';

/**
 * @ngdoc function
 * @name jpApp.controller:JobsCtrl
 * @description
 * # JobsCtrl
 * Controller of the jpApp
 */
angular.module('jpApp')
	.controller('JobCtrl', function ($scope,jobs,$route,$location,$filter,modal,elements,$rootScope)
	{
		this.awesomeThings = [
		  'HTML5 Boilerplate',
		  'AngularJS',
		  'Karma'
		];
		
		$rootScope.$location.title = '';
		
		var autocomplete,self = this;
		
		this.data = {};
		
		console.log($route);
		
		if(!$scope.currentJob){
			jobs.getData('jobs',$route.current.params.jobId).then(function(result){
				$scope.currentJob = result.data;
				$scope.cache = result.data;
				console.log('Got a job',$scope.currentJob);
				$rootScope.$location.title = $scope.currentJob.title;
				angular.element('.loading').hide();
			});

		}
		
		$scope.jobOptions = function(options) {
			switch(options){
				case 'job_status' :  return function(){
					var selected = $filter('filter')($rootScope.job.options.job_status, {value: $scope.currentJob.status});
					return ($scope.currentJob.status && selected.length) ? selected[0].text : 'Not set';
				}
				break;
			}
		};
		
		$scope.updateJob = function(){
			angular.forEach($scope.currentJob,function(value,key){
				console.log('Value',value);
				console.log('Key',key);
				/*if(value){
					if(key === 'job_status'){
						self.data['status'] = value.name
					}else if(key === 'application_deadline'){
						self.data[key] = value
					}else{
						self.data[key+'_id'] = value.id
					}
				}*/
			});
			
			this.data = $scope.currentJob;
			
			console.log('Data',this.data);
			
			//jobs.sendData('jobs',$route.current.params.jobId,this.data).then(function(result){
				//console.log('Got a Response',result);
				//$scope.currentJob = result.data;
			//});
		}
		
		$scope.cancel = function(){
			console.log('Edit Cancelled');
			angular.element('#modal').modal('close');
			//angular.element('#job_location').val('');
			//angular.element('#modal form').get(0).reset();
			//$scope.currentJob = $scope.cache;
			$route.reload();
		}
		
		$scope.edit = function(){
			var modalType	=	'bottom-sheet',
				modalTitle	=	'',
				modalBody	=	'',
				modalFooter	=	'';
			
			modalTitle	+=	'<h4 class="left">Edit Job</h4>';
			modalTitle	+=	'<div class="right">'+elements.form.check({name : 'job_category' , model:'currentJob.status',colSize: 12,label1:'Draft',label2:'Published'})+'</div>';
			
			modalFooter	+=	elements.button({	type	:	'button',	cls:	'btn  red accent-4',	ngClick	:	'cancel()'	},'Cancel');
			modalFooter	+=	elements.button({	type	:	'submit',	cls:	'btn',	ngClick	:	'updateJob()'	},'Save');
			
			modalBody	+=	'<form>';
			modalBody	+=		'<div class="row">';
			modalBody	+=			elements.form.input({ type:'text' ,colSize: 3, cls:'autocomplete', model:'currentJob.title' , label : 'Job Title' , name : 'job_title' , required:true });
			modalBody	+=			elements.form.select({ colSize: 3, cls:'' , label : 'Job Type' , name : 'job_type' , model:'currentJob.job_type' , required:true});
			modalBody	+=			elements.form.select({ colSize: 3, cls:'' , label : 'Job Level' , name : 'job_level' , model:'currentJob.job_level' , required:true});
			modalBody	+=			elements.form.select({ colSize: 3, cls:'' , label : 'Job Category' , name : 'job_category' , model:'currentJob.job_category' , required:true});
			modalBody	+=		'</div>';
			modalBody	+=		'<div class="row">';
			modalBody	+=			elements.form.input({ type:'text' ,colSize: 6, cls:'autocomplete', model:'currentJob.location.name' , label : 'Job Location' , name : 'job_location' , required:true });
			modalBody	+=			elements.form.select({ colSize: 6, cls:'' , model:'currentJob.min_qualifications' , label : 'Minimum Qualification' , name : 'job_min_qualification' });
			modalBody	+=		'</div>';
			modalBody	+=		'<div class="row">';
			modalBody	+=			elements.form.range({ colSize: 12, cls:'', model:'currentJob.min_experience' , label : 'Minimum Experience' , name : 'job_min_experience' , min:0,max:15 });
			modalBody	+=		'</div>';			
			modalBody	+=		'<div class="row">';
			modalBody	+=			'<div class="range-field col m12">';
			modalBody	+=				'<label>Salary</label>';
			modalBody	+=				'<div id="salary"></div>';
			modalBody	+=			'</div>';
			modalBody	+=		'</div>';
			modalBody	+=		'<div class="row">';
			modalBody	+=			elements.form.select({ colSize: 12, cls:'', model:'currentJob.salary_type' , label : 'Salary Type' , name : 'salary_type' , required:true });
			modalBody	+=		'</div>';
			modalBody	+=		'<div class="row">';
			modalBody	+=			elements.form.textarea({ colSize: 12, cls:'' , label : 'Job Description' , name : 'job_description' , model:'currentJob.description' , required:true});
			modalBody	+=		'</div>';
			modalBody	+=		'<div class="row">';
			modalBody	+=			'<div class="range-field col m12">';
			modalBody	+=			'<label>Required Skills</label>';
			modalBody	+=			elements.form.chips({ colSize: 12, cls:'' , label : 'Required Skills' , name : 'required_skills' , model:'currentJob.required_skills',chipType : 'chips-initial'});
			modalBody	+=			'</div>';
			modalBody	+=		'</div>';
			modalBody	+=		'<div class="row">';
			modalBody	+=			elements.form.date({ colSize: 12, cls:'' , label : 'Application Deadline' , name : 'application_deadline' , model:'currentJob.application_deadline', required:true });
			modalBody	+=		'</div>';
			modalBody	+=	'</form>';
        
			
			modal.modal(modalType,modalTitle,modalBody,modalFooter,$scope).then(function(result){
				angular.element('select').material_select();
				
				CKEDITOR.editorConfig	=	function( config ){
					config.toolbar	=	[
						{name:'clipboard',items:['Cut','Copy','Paste','PasteText','Undo','Redo']},
						{name:'paragraph',items:['NumberedList','BulletedList']}
					];
				};
				
				CKEDITOR.replace( 'job_description' ).on( 'change', function( evt ) {
					$scope.currentJob.description = evt.editor.getData();
				});
				
				angular.element('.chips-initial').on('chip.add', function(e, chip){
					$scope.currentJob.required_skills = angular.element(this).material_chip('data');
				}).on('chip.delete', function(e, chip){
					$scope.currentJob.required_skills = angular.element(this).material_chip('data');
				}).material_chip({
					placeholder: 'Skills',
					data: $scope.currentJob.required_skills
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
					
					$scope.currentJob.location.name = place.name ? place.name : '';
					
					place.address_components.map(function(value,key){
						//console.log('Value',value);
						$scope.currentJob.location[value.types[0]] = {};
						$scope.currentJob.location[value.types[0]].long_name = value.long_name ? value.long_name : '';
						$scope.currentJob.location[value.types[0]].short_name = value.short_name ? value.short_name : '';
					});
				});
				
				var slider = angular.element('#salary').get(0);
				
				noUiSlider.create(slider, {
				   start: [20, 80],
				   connect: true,
				   step: 500,
				   range: {
					 'min': 0,
					 'max': 1000000000
				   },
				   format: wNumb({
					 decimals: 0
				   })
				});
				
				slider.noUiSlider.on('change', function(value){
					$scope.currentJob.salary  = value;
				});
				
				
				$('.datepicker').pickadate({
					selectMonths: true, // Creates a dropdown to control month
				}).on('change',function(e){
					$scope.currentJob.application_deadline = new Date(angular.element(e.currentTarget).val());
				});
        
				
			});
		}
		
	});
