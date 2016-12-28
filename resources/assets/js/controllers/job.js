'use strict';

/**
 * @ngdoc function
 * @name jpApp.controller:JobsCtrl
 * @description
 * # JobsCtrl
 * Controller of the jpApp
 */
angular.module('jpApp')
	.controller('JobCtrl', function ($scope,jobs,$route,$location,$filter,modal,elements)
	{
		this.awesomeThings = [
		  'HTML5 Boilerplate',
		  'AngularJS',
		  'Karma'
		];
		
		var self = this;
		
		this.data = {};
		
		console.log($route);
		
		if(!$scope.currentJob){
			jobs.getData('jobs',$route.current.params.jobId).then(function(result){
				$scope.currentJob = result.data;
				console.log('Got a job',$scope.currentJob);
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
			angular.forEach($scope.jobForm.data,function(value,key){
				//console.log('Value',value);
				//console.log('Key',key);
				if(value){
					if(key === 'job_status'){
						self.data['status'] = value.name
					}else if(key === 'application_deadline'){
						self.data[key] = value
					}else{
						self.data[key+'_id'] = value.id
					}
				}
			});
			
			console.log('Data',this.data);
			
			//jobs.sendData('jobs',$route.current.params.jobId,this.data).then(function(result){
				//console.log('Got a Response',result);
				//$scope.currentJob = result.data;
			//});
		}
		
		$scope.edit = function(){
			var modalType	=	'bottom-sheet',
				modalTitle	=	'Edit Job',
				modalBody	=	'',
				modalFooter	=	elements.button({	type	:	'submit',	cls:	'btn-primary btn-lg btn-block',	ngClick	:	''	},'Login');
				
			modal.modal(modalType,modalTitle,modalBody,modalFooter,$scope).then(function(result){
				console.log(result);
			});
		}
		
	});
