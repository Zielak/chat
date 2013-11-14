var sanitizer = require('sanitizer');
var moment = require('moment');

var config = require('../config');



function Message(user, txt){
  //this.id = id;
  this.user = user;
  this.txt = txt;

  this.timeStamp = moment().format('YYYYMMDDHHmmssSS');
}
Message.prototype = {
  constructor: Message
}



var messages = (function () {
//module.exports = function(){
  var _list = [];
  // whats that updating for? wtf?
  var _updating = false;
  

  function validateMessage(o){
    var errors = [];
    
    // Check length
    if( o.txt.length < config.message.txt.min_length ){
      errors.push("MESSAGE_TEXT_TOO_SHORT");
    }

    return errors;
  }


  var addMessage = function(o){
    var errors = [];

    // sanitize without warning..
    o.txt = sanitizer.sanitize(o.txt);

    var errors = validateMessage(o);

    if(errors.length > 0){
      return { status: 'fail', data: errors };
    }else{
      // TODO: Put a timer on user
      var newMsg = new Message(o.user, o.txt);
      _list.push = newMsg;

      return {status: 'ok', data: newMsg };
    }

    
  }

  return {
    list: _list,
    addMessage: addMessage
  };
}());
//};
module.exports = messages;
