'use strict';

/**
 * @ngdoc function
 * @name jpApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the jpApp
 */
angular.module('jpApp')
	.controller('AccountCtrl', function ($scope,jobs,$route,$location,$filter,modal,elements,$rootScope,form,user)
	{
		
		$scope.currentAsset = { user:user.data };//Initialize User data
		
		var autocomplete;
		
		angular.element('ul.tabs').tabs(); //Initialize Tabs
		
		$scope.currentAsset.experience = [{
			job_title 	: 	'Web Developer',
			location 	: 	'Vancouver, BC',
			company 	: 	'XYZ Co',
			dates		:	{	start : new Date() , end : new Date() },
			description : 	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu suscipit mi. Proin blandit sem ac consectetur maximus. Sed nisi quam, maximus a fermentum ac, pharetra eget justo. Quisque ut consequat lorem, pulvinar varius sapien.'
		},{
			job_title 	: 	'Web Manager',
			location 	: 	'Burnaby, BC',
			company 	: 	'ABC Co',
			dates		:	{	start : new Date() , end : new Date() },
			description : 	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu suscipit mi. Proin blandit sem ac consectetur maximus. Sed nisi quam, maximus a fermentum ac, pharetra eget justo. Quisque ut consequat lorem, pulvinar varius sapien.'
		}];
		
		$scope.currentAsset.education = [{
			school	 	: 	'University of the Fraser Valley',
			location 	: 	'Abbotsford, BC',
			field 		: 	'Computer Information Systems',
			degree 		: 	'Bsc',
			dates		:	{	start : new Date() , end : new Date() },
			description : 	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu suscipit mi. Proin blandit sem ac consectetur maximus. Sed nisi quam, maximus a fermentum ac, pharetra eget justo. Quisque ut consequat lorem, pulvinar varius sapien.'
		}];
		
		console.log('currentAsset',$scope.currentAsset);
		
		/**
		 * Edit User Profile
		 */
		$scope.edit = function(){
			var modalType	=	'bottom-sheet',
				modalTitle	=	'',
				modalBody	=	'',
				modalFooter	=	'';
			
			modalTitle	+=	'<h4>Edit Profile</h4>';
			//modalTitle	+=	'<div class="right">'+elements.form.check({name : 'status' , model:'currentAsset.status',colSize: 12,label1:'draft',label2:'published'})+'</div>';
			
			modalFooter	+=	elements.button({	type	:	'button',	cls:	'btn  red accent-4',	ngClick	:	'reset()'	, label : 'Cancel'});
			modalFooter	+=	elements.button({	type	:	'submit',	cls:	'btn',	ngClick	:	'updateProfile()'	, label : 'Save'});
			
			modalBody	=	form.editProfile();
			
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
				
				//Initalize Datepicker
				angular.element('.datepicker').each(function(key,value){
					
					var name = angular.element(value).get(0).name;
					
					angular.element('#'+name).pickadate({
						selectMonths: true, // Creates a dropdown to control month
					}).on('change',function(e){
						$scope.currentAsset[name] = new Date(angular.element(e.currentTarget).val());
					});
				
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
		 * Save User Profile
		 */
		$scope.save = function(){
			
		}
		
		/**
		 * Reset Page
		 */
		$scope.reset = function(){
			console.log('Edit Cancelled');
			angular.element('#modal').modal('close');
			//angular.element('#job_location').val('');
			//angular.element('#modal form').get(0).reset();
			//$scope.currentAsset = $scope.cache;
			$route.reload();
		}
		/**
		 * Add New Experience field when editing profile
		 */
		$scope.addExperience = function(){
			$scope.currentAsset.experience.push({});
		}
		
		/**
		 * Delete Experience field when editing profile
		 * 
		 * @param {int} index - array index 
		 * 
		 */
		$scope.removeExperience = function(index){
			console.log('removeExperience',index);
			$scope.currentAsset.experience.splice(index,1);
		}
		
		/**
		 * Add New Education field when editing profile
		 */
		$scope.addEducation = function(){
			$scope.currentAsset.education.push({});
		}
		
		/**
		 * Delete Education field when editing profile
		 * 
		 * @param {int} index - array index 
		 * 
		 */
		$scope.removeEducation = function(index){
			console.log('removeEducation',index);
			$scope.currentAsset.education.splice(index,1);
		}
	});
