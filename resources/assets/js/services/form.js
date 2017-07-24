'use strict';

/**
 * @ngdoc service
 * @name jpApp.form
 * @description
 * # form
 * Service in the jpApp.
 */
angular.module('jpApp')
	.service('form', function (elements) {
		// AngularJS will instantiate a singleton by calling "new" on this function
		return	{
			/**
			 * Returns the login form
			 * @returns {String}
			 */
			login	:	function(){
				var	str	=	'';
				
				str		+=	'<div class="uk-text-center">'

				str	+=	'	<img class="uk-margin-bottom" width="140" height="120" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjQsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkViZW5lXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iMTQwcHgiIGhlaWdodD0iMTIwcHgiIHZpZXdCb3g9Ii0yOS41IDI3NS41IDE0MCAxMjAiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgLTI5LjUgMjc1LjUgMTQwIDEyMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8ZyBvcGFjaXR5PSIwLjciPg0KCTxwYXRoIGZpbGw9IiNEOEQ4RDgiIGQ9Ik0tNi4zMzMsMjk4LjY1NHY3My42OTFoOTMuNjY3di03My42OTFILTYuMzMzeiBNNzkuNzg4LDM2NC4zNTVIMS42NTZ2LTU3LjcwOWg3OC4xMzJWMzY0LjM1NXoiLz4NCgk8cG9seWdvbiBmaWxsPSIjRDhEOEQ4IiBwb2ludHM9IjUuODYsMzU4LjE0MSAyMS45NjIsMzQxLjIxNiAyNy45OTUsMzQzLjgyNyA0Ny4wMzIsMzIzLjU2MSA1NC41MjQsMzMyLjUyMyA1Ny45MDUsMzMwLjQ4IA0KCQk3Ni4yMDMsMzU4LjE0MSAJIi8+DQoJPGNpcmNsZSBmaWxsPSIjRDhEOEQ4IiBjeD0iMjQuNDYyIiBjeT0iMzIxLjMyMSIgcj0iNy4wMzQiLz4NCjwvZz4NCjwvc3ZnPg0K" alt="">';

				str	+=	'	<form class="uk-panel uk-panel-box uk-form">';
				str	+=	'		<div class="uk-form-row">';
				str	+=				elements.form.input({ 	
														type		:	'email',	
														cls			:	'uk-form-large uk-width-1-1 validate'	,	
														placeholder	:	'Email'	,	
														model		:	'email',
														name		:	'email',
														required	:	true ,
														icon 		:	'user'
													});
				str	+=	'		</div>';
				str	+=	'		<div class="uk-form-row">';
				str	+=				elements.form.input({ 	
														type		:	'password',	
														cls			:	'uk-form-large uk-width-1-1 validate'	,	
														placeholder	:	'Email'	,	
														model		:	'password',
														name		:	'password',
														required	:	true ,
														icon 		:	'lock'
													});
				str	+=	'		</div>';
				str	+=	'		<div class="uk-form-row">';
				str	+=	'			<a class="uk-width-1-1 uk-button uk-button-primary uk-button-large" ng-click="login($event)">Login <i ng-show="loginLoading" class="uk-icon-spinner uk-icon-spin"></i></a>';
				str	+=	'		</div>';
				str	+=	'		<div class="uk-form-row">';
				str	+=	'			<a class="uk-width-1-1 uk-button uk-button-default uk-button-large" ng-click="authenticate(\'linkedin\')">Login with <i class="uk-icon-linkedin-square"></i> <i ng-show="authLoading" class="uk-icon-spinner uk-icon-spin"></i></a>';
				str	+=	'		</div>';
				str	+=	'		<div class="uk-form-row uk-text-small">';
				str	+=	'			<label class="uk-float-left"><input type="checkbox"> Remember Me</label>';
				str	+=	'			<a class="uk-float-right uk-link uk-link-muted" href="#">Forgot Password?</a>';
				str	+=	'		</div>';
				str	+=	'	</form>';

				str	+=	'</div>';
				
				return str;
			},
			/**
			 * Returns the Registration form
			 * @returns {String}
			 */
			register	:	function(){
				var str	=	'';
				
				return str;
			},
			/**
			 * Returns the form to edit a job
			 * @returns {String}
			 */
			editJob		:	function(id){
				
				//console.log('Job id',id);
				
				var str	=	'';
				
					str	+=	'<form>';
					
					str	+=		elements.row(
									elements.form.input({ type:'text' ,colSize: 6, cls:'autocomplete', model:'currentAsset.title' , label : 'Job Title' , name : 'job_title' , required:true })+
									elements.form.input({ type:'text', colSize: 2, cls:'typeahead' , label : 'Job Type e.g Full time , Part time..', name : 'job_types' , model:'currentAsset.job_type.name' , required:true , asset :'job_type',typeahead : { datasets:'jobTypes'}})+
									elements.form.input({ type:'text', colSize: 2, cls:'typeahead' , label : 'Job Level e.g Entry , Junior, Intermediate..' , name : 'job_levels' , model:'currentAsset.job_level.name' , required:true , asset :'job_level',typeahead : { datasets:'jobLevels'}})+
									elements.form.input({ type:'text', colSize: 2, cls:'typeahead' , label : 'Job Category' , name : 'job_categories' , model:'currentAsset.job_category.name' , required:true , asset :'job_category',typeahead : { datasets:'jobCategories'}})
								);
								
					str	+=		elements.row(elements.form.input({ type:'text' ,colSize: 6, cls:'autocomplete', model:'currentAsset.location.name' , label : 'Job Location' , name : 'job_location' , required:true })+
											elements.form.input({ type:'text', colSize: 6, cls:'typeahead' , label : 'Minimum Qualification' , name : 'min_qualifications' , model:'currentAsset.min_qualification' , required:true , asset :'min_qualification',typeahead : { datasets:'minQualification'}})
											);
											
					str	+=		elements.row(elements.form.range({ colSize: 12, cls:'', model:'currentAsset.min_experience' , label : 'Minimum Experience' , name : 'job_min_experience' , min:0,max:15 }));
					
					str	+=		elements.row('<div class="range-field col m12 s12">'+
												'<label>Salary <span class="min"></span> - <span class="max"></span> {{ currentAsset.salary_type.name }}</label>'+
												'<div id="pay"></div>'+
											'</div>');
					
					str	+=		elements.row(elements.form.input({ type:'text', colSize: 12, cls:'typeahead' , label : 'Salary Type' , name : 'salary_types' , model:'currentAsset.salary_type.name' , required:true , asset :'salary_type',typeahead : { datasets:'salaryTypes'}}));
					
					str	+=		elements.row(elements.form.textarea({ colSize: 12, cls:'' , label : 'Job Description' , name : 'job_description' , model:'currentAsset.description' , required:true}));
					
					str	+=		elements.row('<div class="range-field col m12 s12">'+
												'<label>Required Skills</label>'+
					//str	+=				elements.form.chips({ colSize: 12, cls:'hidden' , label : 'Required Skills' , name : 'required_skills' , model:'currentAsset.required_skills',chipType : 'chips-autocomplete'})+
												elements.form.tagit({ colSize: 12, cls:'' , label : 'Required Skills' , name : 'required_skills' , model:'currentAsset.required_skills'})+
											'</div>');
									
					str	+=			elements.row(elements.form.date({ colSize: 12, cls:'' , label : 'Application Deadline' , name : 'application_deadline' , model:'currentAsset.application_deadline', required:true }));
					str	+=	'</form>';
					
				return str;
			},
			/**
			 * Returns the edit company form
			 * @returns {string}
			 */
			editCompany		:	function(){
				var str	=	'';
				
					str	+=	'<form>';
					//str +=		elements.uk-grid(elements.toolbar('ng-click="action()"'));
					str	+=		'<div class="uk-grid">';
					str	+=			elements.form.input({ type:'text' ,colSize: 4, cls:'autocomplete', model:'currentAsset.name' , label : 'Company Name' , name : 'company_name' , required:true });
					str	+=			elements.form.input({ type:'text', colSize: 4, cls:'typeahead' , label : 'Company Type e.g Software , Construction ', name : 'company_cat' , model:'currentAsset.company_category[0].name' , required:true , asset :'company_category',typeahead : { datasets:'companyCats'}});
					//str	+=			elements.form.select({ colSize: 4, cls:'' , label : 'Company Category' , name : 'company_cat' , model:'currentAsset.company_category' , required:true ,asset:'company'});
					str	+=			elements.form.input({ type:'text' ,colSize: 4, cls:'autocomplete', model:'currentAsset.location.name' , label : 'Company Location' , name : 'company_location' , required:true });
					str	+=		'</div>';
					str	+=		'<div class="uk-grid">';
					str	+=			elements.form.input({ type:'text' ,colSize: 8, cls:'', model:'currentAsset.address' , label : 'Company Address' , name : 'company_address' , required:false });
					str	+=			elements.form.input({ type:'text' ,colSize: 4, cls:'', model:'currentAsset.zipcode' , label : 'Zipcode' , name : 'zipcode' , required:false });
					str +=		'</div>';
					str	+=		'<div class="uk-grid">';
					str	+=			elements.form.textarea({ colSize: 12, cls:'' , label : 'Company Description' , name : 'company_description' , model:'currentAsset.description' , required:true});
					str	+=		'</div>';
					str	+=		'<div class="uk-grid">';
					str	+=			elements.form.input({ type:'email' ,colSize: 4, cls:'', model:'currentAsset.email' , label : 'Email Address' , name : 'email' , required:false });
					str	+=			elements.form.input({ type:'tel' ,colSize: 4, cls:'', model:'currentAsset.phone' , label : 'Phone Number' , name : 'phone' , required:false });
					str	+=			elements.form.input({ type:'text' ,colSize: 4, cls:'', model:'currentAsset.logo' , label : 'Company Logo' , name : 'logo' });
					str	+=		'</div>';
					str	+=	'</form>';
					
				return str;
			},
			/**
			 * Returns the edit user profile form
			 * @returns {string}
			 */
			editProfile	:	function(){
				var str	=	'';
				
				str += '<div class="col m12">';
				str += '<div class="uk-grid">';
				str += 		'<h4 class="left">Experience</h4>';
				str += 		'<button ng-click="addExperience()" class="right btn-floating btn-small">'+elements.glyph('add','large')+'</button>';
				str += '</div>';
				str += '<div class="uk-grid card" ng-repeat="exp in currentAsset.experience">';
				str += 		'<div class="uk-grid">';
				str += 			'<button class="right btn-floating btn-small" ng-click="removeExperience($index)">'+elements.glyph('delete','large')+'</button>';
				str += 		'</div>';
				str += 		'<div class="card-content">';
				str += 			elements.form.experience();
				str += 		'</div>';
				str += '</div>';
				str += '</div>';
				str += '<div class="col m12">';
				str += '<div class="uk-grid">';
				str += 		'<h4 class="left">Education</h4>';
				str += 		'<button ng-click="addEducation()" class="right btn-floating">'+elements.glyph('add','large')+'</button>';
				str += '</div>';
				str += '<div class="uk-grid card" ng-repeat="exp in currentAsset.education">';
				str += 		'<div class="uk-grid">';
				str += 			'<button class="right btn-floating btn-small" ng-click="removeEducation($index)">'+elements.glyph('delete','large')+'</button>';
				str += 		'</div>';
				str += 		'<div class="card-content">';
				str += 			elements.form.education();
				str += 		'</div>';
				str += '</div>';
				str += '</div>';
				
				return str;
			},
		};
	});
