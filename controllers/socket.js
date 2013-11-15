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

  socket.emit('config:load', config);

  socket.on('user:login', function(data, fn) {
    //console.log(data.name, ' is trying to log in.');
    
    var user = {};
    var welcome = false;

    // I'm getting password, try to login registered username first
    if(data.pass !== false){
      user = users.loginUser({name: data.name, id: socket.id, pass: data.pass});
      if(user.status === 'ok'){
        welcome = true;
        user = user.data;
      }
    }else{
      user = users.addUser({name: data.name, id: socket.id});
      if( user.status === 'ok' ){
        welcome = true;
        user = user.data;
      }
    }
    

    if(welcome){
      // notify other clients that a new user has joined
      socket.broadcast.emit('user:join', {
        user: user
      });
      socket.broadcast.emit('send:message', messages.serverMessage('User '+user.name+' has joined.'))

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
        var message = messages.addMessage({type: 'user', user: user, txt: data.message});

        if(message.status === 'ok'){
          var send = {status:'ok', data:{message: message.data}};
          socket.broadcast.emit('send:message', send);
          fn(send);
        }else{
          fn({status:'fail', data:message.data});
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
      
      //var usersList = users.list;
      fn({status:'ok', data:{
          user: user,
          users: users.list
        }
      });
    }else{
      fn({status:'fail', data:user.data});
    }
    
    socket.on('disconnect', function() {
      socket.broadcast.emit('user:left', { name: user.name });
      socket.broadcast.emit('send:message', messages.serverMessage('User '+user.name+' has left.'))
      users.kickUser(user.id);
    });
  });

  
}




