'use strict';

/* Directives */

angular.module('chatApp.directives', []).
  directive('appVersion', function (version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }).
  directive('message', function () {
    return {
      scope: {
        item: '=message'
      },
      restrict: 'EA',
      templateUrl: 'ng-templates/message.html'
      };
  }).
  directive('user', function () {
    return {
      scope: {
        item: '=user'
      },
      restrict: 'EA',
      templateUrl: 'ng-templates/user.html'
      };
  });
