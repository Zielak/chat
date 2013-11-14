'use strict';

/* Controllers */

function ChatCtrl($scope, socket) {

  $scope.loginScreen = true;
  $scope.user = {};
  $scope.users = [];
  $scope.messages = [];

  // Socket listeners
  // ================

  /*socket.on('init', function (data) {
    $scope.user = data.user;
    $scope.users = data.users;

    $scope.loginScreen = false;
  });*/

  socket.on('send:message', function (result) {
    $scope.messages.push(result.data.message);
  });

  socket.on('change:name', function (data) {
    changeName(data.oldName, data.newName);
  });

  socket.on('user:join', function (result) {
    $scope.messages.push({
      type: 'server',
      text: 'User ' + result.user.name + ' has joined.'
    });
    $scope.users.push(result.user);
  });

  // add a message to the conversation when a user disconnects or leaves the room
  socket.on('user:left', function (data) {
    $scope.messages.push({
      type: 'server',
      text: 'User ' + data.name + ' has left.'
    });
    var i, u;
    for (i = 0; i < $scope.users.length; i++) {
      u = $scope.users[i];
      if (u.name === data.name) {
        $scope.users.splice(i, 1);
        break;
      }
    }
  });

  // Private helpers
  // ===============

  var changeName = function (oldName, newName) {
    // rename user in list of users
    var i;
    for (i = 0; i < $scope.users.length; i++) {
      if ($scope.users[i] === oldName) {
        $scope.users[i] = newName;
      }
    }

    $scope.messages.push({
      type: 'server',
      text: 'User ' + oldName + ' is now known as ' + newName + '.'
    });
  }

  // Methods published to the scope
  // ==============================

  $scope.logIn = function () {
    socket.emit('user:login', {name: $scope.name}, function (result) {
      if (result.status !== 'ok') {
        alert(result);
      } else {
        /*$scope.messages.push({
          user: 'chatroom',
          text: 'Użytkownik ' + data.name + ' przyłączył się do chatu.'
        });*/
        //$scope.users.push(result.data);

        $scope.user = result.data.user;
        $scope.users = result.data.users;

        $scope.loginScreen = false;
      }
    });
  };
  /*
  $scope.changeName = function () {
    socket.emit('change:name', {name: $scope.newName}, function (result) {
      if (!result) {
        alert('There was an error changing your name');
      } else {
        changeName($scope.name, $scope.newName);

        $scope.name = $scope.newName;
        $scope.newName = '';
      }
    });
  };*/

  $scope.sendMessage = function () {
    socket.emit('send:message', {message: $scope.message}, function(result){
      if(result.status !== 'ok'){
        console.log('whoops');
      }else{
        // add our message to our model locally
        $scope.messages.push(result.data.message);
      }
    });

    // clear message box
    $scope.message = '';
  };

}