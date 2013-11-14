var user = require('sanitizer');
var message = require('moment');

var config = require('../config');

var users = require('./User');
var messages = require('./Message');

/* TODO: do we need authorisation?
io.set('authorization', function (handshakeData, cb) {
  //console.log('Auth: ', handshakeData.query);
  reply = users.addUser({
    name: handshakeData.query.name,
    t: handshakeData.query.t
  });
  if( reply.status !== 'ok' )
    cb(null, false)
  else
    cb(null, true);
});*/

/*
 * INIT
 */


/* ==========================================================
 *  export function for listening to the socket
 * ========================================================*/

module.exports = function (socket) {
  //socket.set('loggedIn', false);
  //socket.emit('connect', {status:'ok', info: "Połączono z serwerem"});
  socket.on('user:login', function(data, fn) {
    //console.log(data.name, ' is trying to log in.');
    
    var user = users.addUser({name: data.name, id: socket.id});
    
    if( user.status === 'ok' ){
      //socket.set('loggedIn', true);

      user = user.data;

      // notify other clients that a new user has joined
      socket.broadcast.emit('user:join', {
        user: user
      });

      // Welcome him and start listening
      /*reply.info = 'Zostales zalogowany '+user.name+', witaj!';
      reply.username = user.name;
      socket.set('name', user.name);*/
      
      // TODO: Prevent duplicate logins from one socket
      // socket.removeListener('login'); - fail
      
      // broadcast a user's message to other users
      // TODO: Flood protection
      // TODO: Moderation
      socket.on('send:message', function (data, fn) {
        var message = messages.addMessage(user, data.message);

        if(message){
          var send = {status:'ok', data:{message: message}};
          socket.broadcast.emit('send:message', send);
          fn(send);
        }else{
          fn({status:'fail', data:messages.errors()});
        }
      });
      // validate a user's name change, and broadcast it on success
      /*socket.on('change:name', function (data, fn) {
        if (users.changeName(user.id, data.name)) {
          oldName = user.name;
          name = data.name;

          socket.broadcast.emit('change:name', {
            oldName: oldName,
            newName: name
          });

          fn(true);
        } else {
          console.log('USER:', user, 'Has failed to change his name.')
          fn(false);
        }
      });*/
      
      
      //socket.broadcast.emit('user '+socket.get('name')+' connected');
      console.log('USERS: list', users.list);
      //var usersList = users.list;
      fn({status:'ok', data:{
          user: user,
          users: users.list
        }
      });
    }else{
      fn({status:'fail', data:users._errors});
    }
    
    socket.on('disconnect', function() {
      socket.broadcast.emit('user:left', {
        name: user.name
      });
      users.kickUser(user.id);
    });
  });

  
}




