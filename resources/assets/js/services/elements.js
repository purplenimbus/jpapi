'use strict';

/**
 * @ngdoc factory
 * @name jpApp.elements
 * @description
 * # elements
 * The Elements Factory in the jpApp.
 * This factory is used to generate all basic HTML elements for the UI.
 */
angular.module('jpApp')
  .factory('elements', function () {
	var mockup = [
		{
			icon : 'insert_chart',
			color : 'red'
		},{
			icon : 'formal_quote',
			color : 'yellow darken-1'
		},{
			icon : 'publish',
			color : 'green'
		},{
			icon : 'attach_file',
			color : 'blue'
		}
	], elementsFactory = this;
    return {
		/**
		 * Returns a row HTML element
		 * @param {String} body - The body of the row element
		 * @param {String} cls - additional classes for the row element
		 * @returns {String}
		 */
		row		:	function(body,cls){
			var str = '';
			
			console.log('Elements str',str);
			
			str += '<div class="uk-grid';
			str += cls ? cls : '';
			str += '">';
			str += 		body;
			str += '</div>';
			
			return str;
		},
		/**
		 * Returns a column HTML element
		 * @param {string} num - num of columns 1-12 as per UIKits Grid System
		 * @param {String} body - The body of the column element
		 * @returns {String}
		 */
		column	:	function(num,body){
			var str=	'',
			width = '';
			
			if(typeof num === 'array' && num.length){
				width = num[0]+'-'+num[1];
			}
			
			str	+=	'<div class="uk-width-'+width+'">';
			str	+=		body;
			str	+=	'</div>';

			return str;
		},
		/**
		 * Returns a button HTML element
		 * @param {Object} object - The object holding the button element properties
		 * @param {String} object.cls - The button class
		 * @param {String} object.type - The button type
		 * @param {String} object.ngClick - ngClick event for the button
		 * @param {String} object.label - The button label
		 * @returns {String}
		 */
		button	:	function(object,body){
			var str	=	'';
			
			str	+=	'<button class="uk-button ';
			str +=		object.cls ? object.cls+'"' : '"';
			str	+=		object.type		?	'type="'+object.type+'"'	:	'';
			str	+=		object.ngClick	?	'ng-click="'+object.ngClick+'">'	:	'>';
			str	+=		object.label ? object.label : 'Button Label';
			str	+=	'</button>';
			
			return str;
		},

		/**
		 * Returns the form object for generic form elements
		 * @returns {object}
		 */
		form	:	{
			/**
			 * Returns uikit icons for form elements
			 * @param {String} type - The type of icon based on https://material.io/icons/
			 * @returns {String}
			 */
			glyph	:	function(type){
				var str	=	'';
				
				//str	+=	'<span class="glyphicon glyphicon-'+type+'" aria-hidden="true"></span>';
				str	+=	'<i class=" uk-icon-';
				str	+=	type ? type+'">' : '">';
				str	+=	'</i>';

				return str;
			},
			/**
			 * Returns an input element
			 * @param {object} object - The object holding the input element attributes
			 * @param {Integer} object.colSize - The column size of the input element ( Defaults to 12 )
			 * @param {string} object.cls - addtional classes for the input element
			 * @param {string} object.label - The label for the input field
			 * @param {String} object.model - The 2 way data binding for to the $scope (Angular Js)
			 * @param {String} object.name - The name attribute for the input element
			 * @param {String} object.value - The value attribute for the input element
			 * @param {boolean} object.required - The required attribute for the input element. Used for validation
			 * @returns {String}
			 */
			input	:	function(object){
				var	str	=	'',self = this;
				
				str +=	'<div class="input-field ';
				str +=  object.icon ? 'uk-form-icon ' : '';
				str +=  object.colSize ? 'col m'+object.colSize.toString()+' uk-width-1-1">' : 'uk-width-1-1">';
				str +=  object.icon ?  self.glyph(object.icon) : '';
				str	+=	'<input ';
				str	+=	object.type	?	'type="'+object.type+'"' : '';
				str	+=	object.cls  ? 	'class="'+object.cls+'"' : '';
				str	+=	object.label ? ' placeholder="'+object.label+'"' : '';
				str	+=	object.model	?	' ng-model="'+object.model+'" '	:	'';
				str	+=	object.value	?	' ng-value="'+object.model+'" '	:	'';
				str	+=	object.name	?	' name="'+object.name+'" id="'+object.name+'"'	:	'';
				str	+=	object.required	?	' data-required="true" required="true"'	:	'';
				//str +=  object.typeahead ? 'sf-typeahead options="typeahead" datasets="'+object.typeahead.datasets+'"' : '';
				if(object.typeahead){
					str +=  object.asset ? 'data-asset="'+object.asset+'"' : '';
				}
				str	+=	'>';
				str	+=	'<label ';
				str	+=	object.model	?	' class="active" '	:	'';
				str	+=  'for="'+object.name+'">';
				str	+=	object.label ?  object.label+(object.required ? ' *' : '') : '';
				str +=  '</label>';
				str +=  '</div>';
				/*
				if(object.typeahead){
					var bloodhound = self.bloodhound('/'+object.asset);
					
					console.log('Bloodhound',bloodhound);
					console.log('Name','#'+object.name);
					console.log('Element',angular.element('#'+object.name));
					
					angular.element('#'+object.name).typeahead(null, {
						name: object.name,
						display: 'name',
						source: bloodhound.ttAdapter(),
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
					});
				}
				*/
				return str;
			},
			/**
			 * Returns an input group element
			 * @param {icon} object - The icon for the element attributes 
			 * @param {object} object - The object holding the element attributes
			 * @returns {String}
			 */
			inputGroup	:	function(icon,object){
				var str		=	'',
					self	=	this;
		
				str	+=	'<div class="input-field">';
				str	+=		'<i class="material-icons prefix">'+icon+'</i>';
				str	+=		self.input(object);
				str	+=	'</div>';
				
				return str;
			},
			/**
			 * Returns a select element
			 * @param {Integer} object.colSize - The column size of the input element ( Defaults to 12 )
			 * @param {string} object.cls - addtional classes for the input element
			 * @param {string} object.label - The label for the input field
			 * @param {String} object.model - The 2 way data binding for to the $scope (Angular Js)
			 * @param {String} object.name - The name attribute for the input element
			 * @param {boolean} object.required - The required attribute for the input element. Used for validation
			 * @returns {String}
			 */
			select	:	function(object){
				var str	=	'';
				
				str +=	'<div class="input-field col m'+object.colSize.toString()+' s12">';
				str +=	'<select ';
				str +=	object.cls ? 'class="'+object.cls+'"' : '';
				str +=	object.model ? 'ng-model="'+object.model+'"' : '';
				str	+=	object.name	?	' name="'+object.name+'" id="'+object.name+'"'	:	'';
				str	+=	object.required	?	' data-required="true" required="true"'	:	'';
				str +=	'ng-options="g as g.name for g in $root[\''+object.asset+'\'].options.'+object.name+'s track by g.id">';
				//str +=	'<option value="" disabled selected>Choose your option</option>';
				str +=	'</select>';
				str +=	object.label ? '<label>'+object.label+(object.required ? ' *' : '')+'</label>' : '';
				str +=	'</div>';
				
				return str;
			},
			/**
			 * Returns a textarea element
			 * @param {Integer} object.colSize - The column size of the element ( Defaults to 12 )
			 * @param {string} object.cls - addtional classes for the element
			 * @param {string} object.label - The label for the element
			 * @param {String} object.model - The 2 way data binding for to the $scope (Angular Js)
			 * @param {String} object.name - The name attribute for the element
			 * @param {boolean} object.required - The required attribute for the element. Used for validation
			 * @returns {String}
			 */
			textarea	:	function(object){
				var str	=	'';
				
				str +=	'<div class="input-field col m'+object.colSize.toString()+' s12">';
				str +=	'<textarea class="materialize-textarea';
				str +=	object.cls ? object.cls+'"' : '"';
				str	+=	object.name	?	' name="'+object.name+'" id="'+object.name+'"'	:	'';
				str	+=	object.required	?	' data-required="true" required="true"'	:	'';
				str +=	object.model ? 'ng-model="'+object.model+'">' : '>';
				str +=	'</textarea>';
				//str +=	object.label ? '<label>'+object.label+'</label>' : '';
				str +=	'</div>';
				
				return str;
			},
			/**
			 * Returns the materialize chips component
			 * @param {object} object - The object holding the chip element properties
			 * @param {string} object.chipType - The chip type based on the materialize
			 * @returns {String}
			 */
			chips	:	function(object){
				var str	=	'';
				
				str	+=	' <div class="chips '+object.chipType+'"></div>';
				return 	str;
			},
			/**
			 * Returns the ui tag it component
			 * @param {object} object - The object holding the chip element properties
			 * @param {string} object.chipType - The chip type based on the materialize
			 * @returns {String}
			 */
			tagit	:	function(object){
				var str	=	'';
				
				str	+=	' <ul id="'+object.name ? object.name : '' +'" class="chips '+object.chipType+'"></ul>';
				
				return 	str;
			},
			/**
			 * Returns the materialize range component
			 * @param {object} object - The object holding the range element properties
			 * @param {string} object.cls - addtional classes for the element
			 * @param {string} object.label - The label for the element
			 * @param {String} object.model - The 2 way data binding for to the $scope (Angular Js)
			 * @param {String} object.name - The name attribute for the element
			 * @param {String} object.min - The maximum range
			 * @param {String} object.max - The minimum range
			 * @param {boolean} object.required - The required attribute for the element. Used for validation
			 * @returns {String}
			 */
			range	:	function(object){
				var str	=	'';
				
				str	+=	'<p class="range-field col m'+object.colSize.toString()+' s12">';
				str	+=		'<label>'+object.label+(object.required ? '*' : '')+' '+( object.model ? ' ( {{ '+object.model+' }} years )' : '' )+'</label>';
				str	+=		'<input type="range"';
				str	+=		object.name	?	' name="'+object.name+'" id="'+object.name+'"'	:	'';
				str	+=		object.model	?	' ng-model="'+object.model+'" '	:	'';
				str	+=		object.min ? 'min="'+object.min+'"' : '';
				str	+=		object.max ? 'max="'+object.max+'"' : '';
				//str	+=		object.step ? 'step="'+object.step+'"' : '';
				str	+=		object.required ? 'required />' : ' />';
				str	+=	'</p>';
				
				return str;
			},
			/**
			 * Returns a switch element
			 * @param {Integer} object.colSize - The column size of the element ( Defaults to 12 )
			 * @param {string} object.cls - addtional classes for the element
			 * @param {string} object.label1 - The label1 for the element
			 * @param {string} object.label2 - The label2 for the element
			 * @param {String} object.model - The 2 way data binding for to the $scope (Angular Js)
			 * @param {String} object.name - The name attribute for the element
			 * @param {boolean} object.required - The required attribute for the element. Used for validation
			 * @returns {String}
			 */
			check	:	function(object){
				var str	=	'';
				
				str	+=	'<div class="switch col m'+object.colSize.toString()+' s12">';
				str	+=	'	<label>';
				str	+=	object.label1;
				str	+=	'	  <input type="checkbox"';
				str	+=	object.model	?	' ng-model="'+object.model+'" '	:	'';
				str	+=	object.name	?	' name="'+object.name+'" id="'+object.name+'"'	:	'';
				str	+=	object.required	?	' data-required="true" required="true"'	:	'';
				str	+=	'	  >';
				str	+=	'	  <span class="lever"></span>';
				str	+=	object.label2;
				str	+=	'	</label>';
				str	+=	'</div>';
  
				return str;
			},
			/**
			 * Returns a date element
			 * @param {Integer} object.colSize - The column size of the date element ( Defaults to 12 )
			 * @param {string} object.cls - addtional classes for the date element
			 * @param {string} object.label - The label for the date field
			 * @param {String} object.model - The 2 way data binding for to the $scope (Angular Js)
			 * @param {String} object.name - The name attribute for the date element
			 * @param {boolean} object.required - The required attribute for the date element. Used for validation
			 * @returns {String}
			 */
			date	:	function(object){
				var str	=	'';
				
				str +=	'<div class="col s12 m'+object.colSize.toString()+'">';
				str +=	object.label ? '<label>'+object.label+(object.required ? ' *' : '')+'</label>' : '';
				str	+= ' <input type="date" ';
				str	+= 'class="datepicker';
				str +=	object.cls ? object.cls+'"' : '"';
				str	+=	object.name	?	' name="'+object.name+'" id="'+object.name+'"'	:	'';
				str	+=	object.model	?	' ng-model="'+object.model+'" '	:	'';
				str	+=	object.required	?	' data-required="true" required="true"'	:	'';
				str	+=	object.required ? 'required />' : ' />';
				str += '</div>';
				
				return str;
			},
			/**
			 * Returns a radio element
			 * @param {Integer} object.colSize - The column size of the date element ( Defaults to 12 )
			 * @param {string} object.cls - addtional classes for the date element
			 * @param {string} object.label - The label for the date field
			 * @param {String} object.model - The 2 way data binding for to the $scope (Angular Js)
			 * @param {String} object.name - The name attribute for the date element
			 * @param {boolean} object.required - The required attribute for the date element. Used for validation
			 * @returns {String}
			 */
			radio	:	function(object){
				var str	=	'';
				
				str +=	'<div class="col s12 m'+object.colSize.toString()+'">';
				str	+= ' <input type="radio" ';
				str	+= 'class="datepicker';
				str +=	object.cls ? object.cls+'"' : '"';
				str	+=	object.name	?	' name="'+object.name+'" id="'+object.name+'"'	:	'';
				str	+=	object.model	?	' ng-model="'+object.model+'" '	:	'';
				str	+=	object.required	?	' data-required="true" required="true"'	:	'';
				str	+=	object.required ? 'required />' : ' />';
				str +=	object.label ? '<label>'+object.label+(object.required ? ' *' : '')+'</label>' : '';
				str += '</div>';
				
				return str;
			},
			/**
			 * Returns the bloodhound twitter typeahead element
			 * @param {string} source - bloodhound prefetch url
			 * @returns {object}
			 */
			bloodhound : function(source){
				var bloodhound = new Bloodhound({
					datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.name); },
					queryTokenizer: Bloodhound.tokenizers.whitespace,
					prefetch: source,
				});
				
				return bloodhound;
			},
			experience : function(){
				var str	=	'',self = this;
								
				str += 	'<div class="uk-grid">';
				//str += 		'<div class="col s12 m4">';
				str += 			self.input({ type: 'text' , colSize: 12 , label:'Job Title' , name:'job_title' , cls:'typeahead', model : 'exp.job_title' });
				//str += 		'</div>';
				//str += 		'<div class="col s12 m4">';
				str += 			self.input({ type: 'text' , colSize: 12 , label:'Company' , name:'company' , cls:'typeahead', model : 'exp.company' });
				//str += 		'</div>';
				//str += 		'<div class="col s12 m4">';
				str += 			self.input({ type:'text' ,colSize: 12, cls:'autocomplete', label : 'Location' , name : 'job_location', model : 'exp.location' });
				//str += 		'</div>';
				str += 	'</div>';
				str += 	'<div class="row">';
				str += 		self.textarea({ type:'text' ,colSize: 12, cls:'', label : 'Description' , name : 'description', model : 'exp.description' });
				str += 	'</div>';
				
				return str;
			},
			education : function(){
				var str	=	'',self = this;
								
				str += '<div class="uk-grid">';
				str += 		'<div class="col s12 m6">';
				str += 			self.input({ type: 'text' , colSize: 12 , label:'School' , name:'school' , cls:'typeahead', model : 'exp.school' });
				str += 		'</div>';
				str += 		'<div class="col s12 m6">';
				str += 			self.input({ type: 'text' , colSize: 12 , label:'Degree' , name:'degree' , cls:'typeahead', model : 'exp.degree' });
				str += 		'</div>';
				str += '</div>';
				str += '<div class="uk-grid">';
				str += 		'<div class="col s12 m6">';
				str += 		self.input({ type: 'text' , colSize: 12 , label:'Field' , name:'field' , cls:'typeahead', model : 'exp.field' });
				str += 		'</div>';
				str += 		'<div class="col s12 m6">';
				str += 			self.input({ type: 'text' , colSize: 12 , label:'Location' , name:'location' , cls:'typeahead', model : 'exp.location' });
				str += 		'</div>';
				str += '</div>';
				str += '<div class="uk-grid">';
				str += 		'<div class="col m6 s12">';
				str += 			self.date({	colSize: 12 , label:'Start Date' , name:'start' , cls:'', model : 'exp.dates.start' });
				str += 		'</div>';
				str += 		'<div class="col m6 s12">';
				str += 			self.date({ colSize: 12 , label:'End Date' , name:'end' , cls:'', model : 'exp.dates.end' });
				str += 		'</div>';
				str += '</div>';
				
				
				return str;
			}
		},
		/**
		 * Returns uikit icons
		 * @param {String} type - The type of icon based on https://material.io/icons/
		 * @returns {String}
		 */
		glyph	:	function(type){
			var str	=	'';
			
			//str	+=	'<span class="glyphicon glyphicon-'+type+'" aria-hidden="true"></span>';
			str	+=	'<i class=" uk-icon-';
			str	+=	type ? type+'">' : '">';
			str	+=	'</i>';

			return str;
		},
		
    };
  });
