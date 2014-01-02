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
