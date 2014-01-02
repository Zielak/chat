'use strict';

var app = angular.module('chatApp', [ 'ngAnimate', 'toaster' ]);



app.animation('.message-animate', function() {
  return {
    enter : function(element, done) {
      jQuery(element).css({
        position:'relative',
        top:'-1rem',
        opacity:0
      });
      jQuery(element).animate({
        top:0,
        opacity:1
      }, done);
    },

    leave : function(element, done) {
      jQuery(element).css({
        position:'relative',
        left:0,
        opacity:1
      });
      jQuery(element).animate({
        left:-30,
        opacity:0
      }, done);
    },

    move : function(element, done) {
      jQuery(element).css({
        opacity:0.5
      });
      jQuery(element).animate({
        opacity:1
      }, done);
    }
  };
});


window.onload = function () {
  // focus on the input field for easy access...
  var input = document.getElementById ('loginField');
  input.focus();
  // ...but if someone wishes to go back in their history, let them!
  document.onkeydown = function (e) {
    if (!e) {
      var e = window.event;
    }
    if (e.keyCode === 8 && !input.value) {
      history.back();
    }
  };
};

/*
function toast( d, t ){
  console.log('Toast: received toast', d)
  if(typeof d==='undefined') return false;
  if(d.info == '') return false;
  var duration = t*1000 || 3000;
  $('.toasts').append('<div class="toast"></div>');
  var toast = $('.toasts :last-child');
  switch( d.status ){
    case 'fail':
      toast.addClass('fail');
      break;
    case 'warn':
      toast.addClass('warn');
      break;
    default:
      toast.addClass('ok');
      break;
  }
  toast.html( d.info ).delay( duration ).slideUp( {
    done: function(){
      $(this).remove();
    },
    duration : 500 
  });
}*/


/*
window.onload = function() {
 
  var messages = [];
  var loggedIn = false;
  
  var msgText = $("#msg-text");
  var msgSend = $("#msg-submit");
  var content = document.getElementById("content");
  var usersList = $('#usersList .users');
  
  var loginForm = $('.login-form')
  var loginSend = $("#login-submit");
  var loginText = $("#login-name");
  
  var chatForm = $('chat-form');
  
  var socket;
  
  // TODO: Change of concept, connect at once, then verify login
  //       because I can't pass data on connect...

  socket = io.connect(document.location.href);  //'http://s2.mydevil.net:1991/'
  socket.on('connect', function (reply) {
    toast(reply);
  });
  
  loginForm.submit(function(e){
    e.preventDefault();
    
    socket.on('loginStatus', function(reply){
      toast(reply);
      
      $('#name').html();
      $('#login').hide();
      loggedIn = true;
      
      loginAuthorized();
    });
    
    socket.emit('login', { username: loginText.val() });
    
    
    socket.on('usersUpdate', function (data) {
      console.log('USERS: received list of users', data);
      usersList.html('');
      for(var i=0; i<data.length; i++){
        var u = data[i];
        usersList.append('<a href="#pm-'+u.name+'"><b>'+u.name+'</b></a>');
      }
    });
    /*
    $.get('/user?name='+loginText.val() , function(data) {
      if( data.status === 'ok' || data.status === 'warn')
      {
        if( data.status === 'warn') 
          toast(data);
        connectMe(data);
      }else if( data.status === 'fail' ){
        loginText.val( data.name );
        toast(data);
      }
    });//*
  });
  
  function loginAuthorized(){
    socket.on('message', function (data) {
      if(!loggedIn) return false;
      if(data.message) {
        messages.push(data);
        var html = '';
        for(var i=0; i<messages.length; i++) {
          if( messages[i].username == "Server" ){
            html += '<div class="server-info">' + messages[i].message + '</div>';
          }else{
            html += '<div class="message">';
            html += '<span class="username">' + messages[i].username + ': </span>';
            html += messages[i].message + '</div>';
          }
        }
        content.innerHTML = html;
        content.scrollTop = content.scrollHeight;
      } else {
        console.log("There is a problem:", data);
      }
    });
  }
  
  chatForm.submit( function(e){
    e.preventDefaults();
    if(!loggedIn) return false;
    
    var text = msgText.val();
    socket.emit('send', { message: text });
    msgText.value = "";
  });
  
  
}*/



/* Controllers */

app.controller('chatCtrl', ['$scope', 'socket', 'toaster', function($scope, socket, toaster){

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

}]);



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



/* Filters */

app.filter('interpolate', function (version) {
  return function (text) {
    return String(text).replace(/\%VERSION\%/mg, version);
  }
});
app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});



/* Services */

app.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        console.log('SOCKET:on "'+eventName+'"',arguments);
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        console.log('SOCKET:emit "'+eventName+'"',data,arguments);
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});
