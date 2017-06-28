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
						
			var str	=	'',
				deferred	=	$q.defer();
			
			str	+=	'<div id="modal" class="uk-modal '+type+'">';
			str += 		'<div class="uk-modal-dialog">';
			str	+=			title ? '<div class="uk-modal-header">'+title+'</div>' : '';
			str	+=				body;
			str	+=			footer ? '<div class="uk-modal-footer">'+footer+'</div>' : '';
			str	+=		'</div>';
			str	+=	'</div>';
			
			angular.element('body').append($compile(str)($scope));
			
			$window.UIkit.modal('#modal').on({

				'hide.uk.modal': function(){
					angular.element('#modal').remove();
				}
				
			}).show();
			
			return deferred.promise;
			
			deferred.resolve(str);
		}
	};
});
