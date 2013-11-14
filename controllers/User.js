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
    for(var i=0,j=_online.length; i<j; i++){
      if( o.name == _online[i].name ){
        _errors.push("Użytkownik z takim nickiem jest już zalogowany.");
      }
    };
    for(var i=0,j=_registered.length; i<j; i++){
      if( o.name == _registered[i].name ){
        _errors.push("Ten nick jest zarejestrowany. Podaj hasło jeżeli jesteś jego posiadaczem.");
      }
    };
    
    if(_errors.length > 0){
      return { status: 'fail', data: _errors };
    }else{
      var newGuy = new User(o.id, o.name, o.group, o.pass);
      //_list[o.id] = newGuy;
      _online.push(newGuy);

      /*console.log( 'USERS: added new user', moment().format('YYYYMMDDHHmmssSS') );
      console.log( _list );*/

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

    return found;
  }

  return {
    list: _online,
    online: _online,
    registered: _registered,
    errors: _errors,

    addUser: addUser,
    kickUser: kickUser,
    changeName: changeName,
    find: find
  };
//};
}());

module.exports = users;
//exports.list = users;