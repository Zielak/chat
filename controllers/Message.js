var sanitizer = require('sanitizer');
var moment = require('moment');

var config = require('../config');

var users = require('./User');


function Message(type, txt, user){
  this.type = type;
  this.txt = txt;
  this.user = user || 'server';

  this.timeStamp = moment().format('YYYYMMDDHHmmssSS');
}
Message.prototype = {
  constructor: Message
}
var serverUser = {
  id: 'server',
  name: 'server',
  group: 'server'
}


var messages = (function () {
//module.exports = function(){
  var _list = [];
  
  function validateMessage(o){
    var errors = [];
    
    // prevent unknown message type from bad coders (lol)
    if(typeof o.type === 'undefined'){
      errors.push('MESSAGE_TYPE_UNKNOWN');
    }

    // Server events get unlimited length
    if(o.type !== 'event'){
      // Check length
      if( o.txt.length < config.message.txt.min_length ){
        errors.push("MESSAGE_TEXT_TOO_SHORT");
      }else if( o.txt.length > config.message.txt.max_length ){
        errors.push("MESSAGE_TEXT_TOO_LONG");
      }

      // Check if user is valid
      if( users.find( { id: o.user.id, where:'online'} ) === false ){
        errors.push("MESSAGE_USER_NOT_FOUND");
      }
    }

    return errors;
  }


  var addMessage = function(o){
    var errors = [];

    // sanitize text without warning..
    o.txt = sanitizer.sanitize(o.txt);

    var errors = validateMessage(o);

    if(errors.length > 0){
      return { status: 'fail', data: errors };
    }else{
      if(o.type === 'user'){
        // TODO: Put a timer on user
        var newMsg = new Message(o.type, o.txt, o.user);
      }else if(o.type === 'event'){
        var newMsg = new Message(o.type, o.txt, serverUser);
      }
      _list.push = newMsg;

      return {status: 'ok', data: newMsg };
    }
  }

  var serverMessage = function(text){
    var msg = addMessage({
      type: 'event',
      txt: text
    });
    return { data: { message: msg.data, status: msg.status } }; 
  }

  return {
    list: _list,
    addMessage: addMessage,
    serverMessage: serverMessage
  };
}());
//};
module.exports = messages;
