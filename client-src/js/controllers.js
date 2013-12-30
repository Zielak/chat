/* Controllers */

function ChatCtrl($scope, socket, toaster) {

  $scope.loginScreen = true;
  $scope.loginPassword = '';
  $scope.user = {};
  $scope.name = '';
  $scope.users = [];
  $scope.message = '';
  $scope.messages = [];

  $scope.config = {};

  // Socket listeners
  // ================

  /*socket.on('init', function (data) {
    $scope.user = data.user;
    $scope.users = data.users;

    $scope.loginScreen = false;
  });*/
  socket.on('config:load', function (result) {
    $scope.config = result.data;
  });

  socket.on('send:message', function (result) {
    $scope.messages.push(result.data.message);
  });

  socket.on('change:name', function (data) {
    changeName(data.oldName, data.newName);
  });

  socket.on('user:join', function (result) {
    /*$scope.messages.push({
      type: 'server',
      text: 'User ' + result.user.name + ' has joined.'
    });*/
    $scope.users.push(result.user);
  });

  // add a message to the conversation when a user disconnects or leaves the room
  socket.on('user:left', function (data) {
    /*$scope.messages.push({
      type: 'server',
      text: 'User ' + data.name + ' has left.'
    });*/
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

  $scope.loginRegisteredChange = function(){
    $scope.loginPassword = '';
    // TODO: add HTML5 required tag if password is visible
    // $scope.loginPassword.required = true;
  }

  $scope.logIn = function () {
    var pass = false;
    if($scope.loginRegistered) pass = $scope.loginPassword;
    socket.emit('user:login', {name: $scope.name, pass: pass}, function (result) {
      if (result.status !== 'ok') {
        toaster.pop('error', 'Błąd podczas logowania', result.data.toString().replace(/\,/g,"\n"));
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
        $scope.pop('error', 'Błąd podczas wysyłania wiadomości', result.data.toString().replace(/\,/g,"\n"))
      }else{
        // add our message to our model locally
        $scope.messages.push(result.data.message);
      }
    });

    // clear message box
    $scope.message = '';
  };


  $scope.pop = function(type, title, text){
    toaster.pop(type, title, text);
  };

}