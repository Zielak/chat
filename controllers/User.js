var sanitizer = require('sanitizer');
var moment = require('moment');

var config = require('../config');



//console.log( 'USERS: initing', moment().format('YYYYMMDDHHmmssSS') );


function User(id, name, group){
  this.id = id;
  this.name = name;
  this.group = group || 'guests';

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
  var _list = [];
  var _errors = [];
  var _updating = false;

  /*var list = function() {
    return _list;
  };*/
  /*
  var errors = function(){
    return _errors;
  }*/
  var addUser = function(o){
    _errors = [];
    // TODO: check if user ID already is logged in
    
    // sanitize without warning..
    // TODO: put some warning, make reply an array of toast messages
    /*if( o.name.search(/[^a-z0-9]/gi) >= 0 ){
      o.name = o.name.replace(/[^a-z0-9]/gi,'');
    }*/
    o.name = sanitizer.sanitize(o.name);
    
    // Check length
    if( o.name.length < 3 ){
      _errors.push("Minimum 3 znaki");
    }
    
    // Check if user exists
    for(var i=0,j=_list.length; i<j; i++){
      if( o.name == _list[i].name ){
        _errors.push("Użytkownik z takim nickiem już istnieje.");
      }
    };
    
    if(_errors.length > 0){
      return { status: 'fail', data: _errors };
    }else{
      var newGuy = new User(o.id, o.name);
      //_list[o.id] = newGuy;
      _list.push(newGuy);

      /*console.log( 'USERS: added new user', moment().format('YYYYMMDDHHmmssSS') );
      console.log( _list );*/

      return {status: 'ok', data: newGuy };
    }
  }
  var removeUser = function(id){
    for(var i = _list.length - 1; i >= 0; i--) {
      if(_list[i].id === id) {
        _list.splice(i, 1);
        //delete _list[i];
      }
    }
  };
  var changeName = function(id, name){
    // Check if name is taken
    if( !find({name: name}) ){
      _list[id].name = name;
      return true;
    }else{
      return false;
    }
  }

  var find = function(o){
    var found = false;
    if(typeof o.id !== 'undefined'){
      for(var i = _list.length - 1; i >= 0; i--) {
        if(_list[i].id === o.id) {
          found = { foundBy: 'id', user: _list[i] };
        }
      }
    }
    if(typeof o.name !== 'undefined'){
      for(var i = _list.length - 1; i >= 0; i--) {
        if(_list[i].name === o.name) {
          found = { foundBy: 'name', user: _list[i] };
        }
      }
    }
    return found;
  }

  return {
    list: _list,
    errors: _errors,
    addUser: addUser,
    removeUser: removeUser,
    changeName: changeName,
    find: find
  };
//};
}());

module.exports = users;
//exports.list = users;