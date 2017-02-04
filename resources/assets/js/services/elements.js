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
	], self = this;
    return {
		/**
		 * Returns a row HTML element
		 * @param {String} body - The body of the row element
		 * @param {String} cls - additional classes for the row element
		 * @returns {String}
		 */
		row		:	function(body,cls){
			var str = '';
			
			str += '<div class="row';
			str += cls ? cls : '';
			str += '">';
			str += 		body;
			str += '</div>';
			
			return str;
		},
		/**
		 * Returns a column HTML element
		 * @param {Integer} str - num of columns 1-12
		 * @param {String} body - The body of the column element
		 * @returns {String}
		 */
		column	:	function(num,body){
			var str=	'';
			if( typeof num ===	'number'){
				str	+=	'<div class="col m'+num+'">';
				str	+=		body;
				str	+=	'</div>';
				
				return str;
			}else{
				str	+=	'<div class="col m'+num[0]+' s'+num[1]+'">';
				str	+=		body;
				str	+=	'</div>';
				
				return str;
			}
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
			
			str	+=	'<button class="btn ';
			str +=		object.cls ? object.cls+'"' : '"';
			str	+=		object.type		?	'type="'+object.type+'"'	:	'';
			str	+=		object.ngClick	?	'ng-click="'+object.ngClick+'">'	:	'>';
			str	+=		object.label ? object.label : 'Button Label';
			str	+=	'</button>';
			
			return str;
		},
		/**
		 * Returns a materalize button toolbar
		 * @param {string} action - The action associated the primary button
		 * @param {string} icon - The icon for the secondary button
		 * @param {array} array - The array holding the secondary buttons objects
		 * @param {String} array.value.color - The secondary button color based on materialize
		 * @param {String} array.value.action - The secondary action
		 * @param {String} array.value.icon - The secondary button icon
		 * @returns {String}
		 */
		toolbar : function(action,type,icon,array){
			var str = '';
			
			str += '<div class="fixed-action-btn '+(type ? 'horizontal' : '')+' click-to-toggle">';
			str += '	<a class="btn-floating btn-large red" '+action+'>';
			str += '	  <i class="material-icons">'+(icon ? icon : 'menu')+'</i>';
			str += '	</a>';
			if(array){ 
			str += '<ul>';
				angular.forEach(array,function(value,key){
					str += value ? '<li><a class="btn-floating '+(value.color ? value.color : 'red')+'" '+(value.action ? value.action : '')+'><i class="material-icons">'+(value.icon ? value.icon : 'insert_chart')+'</i></a></li>' : '';
				});
			str += '</ul>';
			}
			str += '</div>';;
		},
		/**
		 * Returns the form object for generic form elements
		 * @returns {object}
		 */
		form	:	{
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
				str +=  object.colSize ? 'col m'+object.colSize.toString()+' s12">' : 'col s12">';
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
			}
		},
		/**
		 * Returns materalize icons
		 * @param {String} type - The type of icon based on https://material.io/icons/
		 * @returns {String}
		 */
		glyph	:	function(type){
			var str	=	'';
			
			str	+=	'<span class="glyphicon glyphicon-'+type+'" aria-hidden="true"></span>';

			return str;
		}
    };
  });
