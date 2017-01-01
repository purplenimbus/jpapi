'use strict';

/**
 * @ngdoc service
 * @name jpApp.elements
 * @description
 * # elements
 * Factory in the jpApp.
 */
angular.module('jpApp')
  .factory('elements', function () {
    return {
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
		form	:	{
			
			input	:	function(object){
				var	str	=	'';
				
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
				str	+=	'>';
				str	+=	'<label ';
				str	+=	object.model	?	' class="active" '	:	'';
				str	+=  'for="'+object.name+'">';
				str	+=	object.label ?  object.label+(object.required ? ' *' : '') : '';
				str +=  '</label>';
				str +=  '</div>';

				return str;
			},
			
			inputGroup	:	function(icon,object){
				var str		=	'',
					self	=	this;
		
				str	+=	'<div class="input-field">';
				str	+=		'<i class="material-icons prefix">'+icon+'</i>';
				str	+=		self.input(object);
				str	+=	'</div>';
				
				return str;
			},
			
			select	:	function(object){
				var str	=	'';
				
				str +=	'<div class="input-field col m'+object.colSize.toString()+' s12">';
				str +=	'<select ';
				str +=	object.cls ? 'class="'+object.cls+'"' : '';
				str +=	object.model ? 'ng-model="'+object.model+'"' : '';
				str	+=	object.name	?	' name="'+object.name+'" id="'+object.name+'"'	:	'';
				str	+=	object.required	?	' data-required="true" required="true"'	:	'';
				str +=	'ng-options="g as g.name for g in $root.job.options.'+object.name+'s track by g.id">';
				//str +=	'<option value="" disabled selected>Choose your option</option>';
				str +=	'</select>';
				str +=	object.label ? '<label>'+object.label+(object.required ? ' *' : '')+'</label>' : '';
				str +=	'</div>';
				return str;
			},
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
			chips	:	function(object){
				var str	=	'';
				
				str	+=	' <div class="chips '+object.chipType+'"></div>';
				return 	str;
			},
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
			}
		},
		glyph	:	function(type){
			var str	=	'';
			
			str	+=	'<span class="glyphicon glyphicon-'+type+'" aria-hidden="true"></span>';

			return str;
		}
    };
  });
