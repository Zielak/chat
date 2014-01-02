/* Directives */

app.directive('appVersion', function (version) {
  return function(scope, elm, attrs) {
    elm.text(version);
  };
})
app.directive('message', function () {
  return {
    scope: {
      item: '=message'
    },
    restrict: 'EA',
    templateUrl: 'directives/message.html'
  };
})
app.directive('user', function () {
  return {
    scope: {
      item: '=user'
    },
    restrict: 'EA',
    templateUrl: 'directives/user.html'
  };
});
