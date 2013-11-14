var sanitizer = require('sanitizer');
var moment = require('moment');

var config = require('../config');



//console.log( 'USERS: initing', moment().format('YYYYMMDDHHmmssSS') );


function User(id, name, group, pass){
  this.id = id;
  this.name = name;
  this.group = group || 'guests';
  this.pass = pass || false;

  // This is anti-flood timer
  this.timer = 0;

  // Points to user's last message
  this.lastMessage = {};
}
User.prototype = {
  constructor: User
}


var users = (function () {
//module.exports = function(){
  var _online = [];
  var _registered = [];
  var _updating = false;
  


  function validateNewUsername(o){
    var errors = [];
    // TODO: check if user ID already is logged in
    
    // sanitize without warning..
    // TODO: put some warning, make reply an array of toast messages
    /*if( o.name.search(/[^a-z0-9]/gi) >= 0 ){
      o.name = o.name.replace(/[^a-z0-9]/gi,'');
    }*/
    o.name = sanitizer.sanitize(o.name);
    
    // Undefined?
    if( o.name == undefined ){
      o.name = '';
    }

    // Check length
    if( o.name.length < config.user.name.min_length ){
      errors.push("USER_NAME_TOO_SHORT");
    }
    
    // Check if user exists
    for(var i=0,j=_online.length; i<j; i++){
      if( o.name == _online[i].name ){
        errors.push("USER_NAME_ALREADY_ONLINE");
      }
    };
    for(var i=0,j=_registered.length; i<j; i++){
      if( o.name == _registered[i].name ){
        errors.push("USER_NAME_REGISTERED");
      }
    };

    return errors;
  }



  var addUser = function(o){
    var errors = validateNewUsername(o);
    
    if(errors.length > 0){
      return { status: 'fail', data: errors };
    }else{
      var newGuy = new User(o.id, o.name, o.group, o.pass);
      _online.push(newGuy);

      return {status: 'ok', data: newGuy };
    }
  }

  var registerUser = function(o){
    var errors = validateNewUsername(o);
    
    if(errors.length > 0){
      return { status: 'fail', data: errors };
    }else{
      var newGuy = new User(o.id, o.name, o.group, o.pass);
      _registered.push(newGuy);
      // TODO: push this guy to database or something
      
      return {status: 'ok', data: newGuy };
    }
  }

  // TODO: rename to kickUser!
  var kickUser = function(id){
    for(var i = _online.length - 1; i >= 0; i--) {
      if(_online[i].id === id) {
        _online.splice(i, 1);
        //delete _list[i];
      }
    }
  };

  var changeName = function(id, name){
    // Check if name is taken
    if( !find({name: name}) ){
      _online[id].name = name;
      return true;
    }else{
      return false;
    }
  }

  var find = function(o){
    var found = false;
    var where = (typeof o.where !== 'undefined') ? o.where : 'everywhere';
    var byWhat = 'name';
    
    console.log('where',where)

    if(typeof o.name !== 'undefined'){
      byWhat = 'name';
    }else if(typeof o.id !== 'undefined'){
      byWhat = 'id'
    }

    if(where === 'everywhere' || where === 'online')
      for(var i = _online.length - 1; i >= 0; i--) {
        if(_online[i].id === o.id) {
          found = { foundBy: 'id', foundIn: 'online', user: _online[i] };
        }
      }

    if(where === 'everywhere' || where === 'registered')
      for(var i = _registered.length - 1; i >= 0; i--) {
        if(_registered[i].id === o.id) {
          found = { foundBy: 'id', foundIn: 'registered', user: _registered[i] };
        }
      }
    console.log("USER.FIND: looging for:", o)
    console.log("USER.FIND: found:", found);
    console.log("USER.REGISTERED:",_registered);
    console.log("USER.ONLINE:",_online);
    return found;
  }

  return {
    list: _online,
    online: _online,
    registered: _registered,

    addUser: addUser,
    registerUser: registerUser,
    kickUser: kickUser,
    changeName: changeName,
    find: find
  };
//};
}());

module.exports = users;
//exports.list = users;