var sanitizer = require('sanitizer');
var moment = require('moment');

var config = require('../config');



function Message(user, text){
  //this.id = id;
  this.user = user;
  this.text = text;

  this.timeStamp = moment().format('YYYYMMDDHHmmssSS');
}
Message.prototype = {
  constructor: Message
}



var messages = (function () {
//module.exports = function(){
  var _list = [];
  var _errors = [];
  var _updating = false;

  var list = function() {
    return _list;
  };
  var errors = function(){
    return _errors;
  }
  var addMessage = function(user, text){
    _errors = [];

    // sanitize without warning..
    text = sanitizer.sanitize(text);
    
    // Check length
    if( text.length < 2 ){
      _errors.push("Minimum 2 znaki");
      return false;
    }

    // Put a timer on user


    
    var newMsg = new Message(user, text);
    _list.push = newMsg;

    return newMsg;
  }

  return {
    list: list,
    errors: errors,
    addMessage: addMessage
  };
}());
//};
module.exports = messages;
