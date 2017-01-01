'use strict';

/**
 * @ngdoc service
 * @name jpApp.jobs
 * @description
 * # jobs
 * Service in the jpApp.
 */
angular.module('jpApp')
	.service('companies', function ($http,elements) {
		// AngularJS will instantiate a singleton by calling "new" on this function
		return{
			getData	:	function($data,$id){
				console.log($data+' id',$id);
				if($id){
					return $http.get($data+'/'+$id);
				}else{
					return	$http.get($data);
				}
			},
			sendData	:	function($name,$id,$data){
				console.log($name+' id',$id);
				if($id){
					return $http.put($name+'/'+$id,$data);
				}else{
					return	$http.post($name,$data);
				}
			},
			editCompany		:	function(){
				var str	=	'';
				
					str	+=	'<form>';
					str	+=		'<div class="row">';
					str	+=			elements.form.input({ type:'text' ,colSize: 6, cls:'autocomplete', model:'currentCompany.name' , label : 'Company Name' , name : 'company_name' , required:true });
					str	+=			elements.form.select({ colSize: 6, cls:'' , label : 'Company Category' , name : 'company_category' , model:'currentCompany.company_category' , required:true});
					str	+=			elements.form.input({ type:'text' ,colSize: 6, cls:'autocomplete', model:'currentCompany.location.name' , label : 'Company Location' , name : 'company_location' , required:true });
					str	+=		'</div>';
					str	+=		'<div class="row">';
					str	+=			elements.form.input({ type:'address' ,colSize: 4, cls:'', model:'currentCompany.address' , label : 'Company Address' , name : 'compant_address' , required:false });
					str +=		'</div>';
					str	+=		'<div class="row">';
					str	+=			elements.form.textarea({ colSize: 12, cls:'' , label : 'Company Description' , name : 'company_description' , model:'currentCompany.description' , required:true});
					str	+=		'</div>';
					str	+=		'<div class="row">';
					str	+=			elements.form.input({ type:'email' ,colSize: 4, cls:'', model:'currentCompany.email' , label : 'Email Address' , name : 'email' , required:false });
					str	+=			elements.form.input({ type:'tel' ,colSize: 4, cls:'', model:'currentCompany.phone' , label : 'Phone Number' , name : 'phone' , required:false });
					str	+=			elements.form.input({ type:'text' ,colSize: 4, cls:'', model:'currentCompany.logo' , label : 'Company Logo' , name : 'logo' });
					str	+=		'</div>';
					str	+=	'</form>';
					
				return str;
			}
		};
	});
