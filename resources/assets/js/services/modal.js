'use strict';

/**
 * @ngdoc service
 * @name jpApp.modalService
 * @description
 * # modalService
 * Service in the jpApp.
 */
angular.module('jpApp')
  .service('modal', function ($q,$compile,$window) {
    // AngularJS will instantiate a singleton by calling "new" on this function
	return	{
		modal	:	function(type,title,body,footer,$scope){
			
			$scope.modal = {};
						
			var str	=	'',
				deferred	=	$q.defer();
			
			str	+=	'<div id="modal" class="uk-modal '+type+'">';
			str += 		'<div class="uk-modal-dialog">';
			str +=  		'<div class="uk-modal-spinner uk-hidden"></div>';
			str	+=			title ? '<div class="uk-modal-header">'+title+'</div>' : '';
			str	+=				'<div class="uk-alert uk-hidden">';
			str	+=				'<a href="" class="uk-alert-close uk-close"></a>';
			str	+=				'<p></p>';
			str +=				'</div>';
			str	+=				body;
			str	+=			footer ? '<div class="uk-modal-footer">'+footer+'</div>' : '';
			str	+=		'</div>';
			str	+=	'</div>';
			
			angular.element('body').append($compile(str)($scope));
			
			console.log('Modal $window',$window);
			
			$window.UIkit.modal('#modal').show().on({
				'hide.uk.modal': function(){
					angular.element('#modal').remove();
					angular.element('html').removeClass('uk-modal-page');
				}
			});
			
			
			return deferred.promise;
			
			deferred.resolve(str);
		}
	};
});
