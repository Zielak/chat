var sanitizer = require('sanitizer');
var moment = require('moment');

var config = require('../config');
var credentials = require('./Credentials');




function User(id, name, group, pass){
  this.id = id;
  this.name = name;
  // groups: 'guests', 'mods', 'admins'
  this.group = group || 'guests';
  this.pass = pass || false;

  // ### Additional properties

  // Is user hidden from users list?
  this.hidden = false;

  // This is anti-flood timer
  this.timer = 0;

  // That was the user's last message
  this.lastMessage = {};
}
User.prototype = {
  constructor: User
}





var users = (function () {
  var _online = [];
  var _registered = [];
  var _updating = false;
  

  /**
  * Validates if name is acceptable, not harmful,
  * not taken or not registered.
  *
  * @method validateNewUsername
  * @param {Object} whole User object, only .name is validated now though.
  * @return {Array} array with list of error codes, if empty - everything is OK.
  */

  // TODO: Convert this for validateNewUser ? I could also use that in loginUser()
  function validateNewUsername(o){
    var errors = [];

    // TODO: check if user ID already is logged in
    
    // sanitize without warning..
    // TODO: put some warning, make reply an array of toast messages
    /*if( o.name.search(/[^a-z0-9]/gi) >= 0 ){
      o.name = o.name.replace(/[^a-z0-9]/gi,'');
    }*/
    if(typeof o === 'undefined'){
      errors.push("USER_EMPTY_CALL");
      return errors;
    }

    o.name = sanitizer.sanitize(o.name);
    
    // Undefined?
    /*if( o.name === 'undefined' ){
      o.name = '';
    }*/

    // Check length
    if( o.name.length < config.user.name.min_length ){
      errors.push("USER_NAME_TOO_SHORT");
    }
    
    // Check if user exists
    for(var i=0,j=_online.length; i<j; i++){
      if( o.name == _online[i].name ){
        errors.push("USER_NAME_ALREADY_ONLINE");
        break;
      }
    };
    for(var i=0,j=_registered.length; i<j; i++){
      if( o.name == _registered[i].name ){
        errors.push("USER_NAME_REGISTERED");
        break;
      }
    };

    // Don't allow restricted usernames
    // TODO: string search, even the part of username can't 
    //       contain restricted words.
    for (var i = config.restricted.userNames.length - 1; i >= 0; i--) {
      if( o.name === config.restricted.userNames[i]){
        errors.push("USER_NAME_RESTRICTED");
        break;
      }
    };

    return errors;
  }






  /**
  * Tries to add new user from socket to _online table
  *
  * @method addUser
  * @param {Object} whole User object from socket, needs to have id, name, group, and pass (if any)
  * @return {Object} object with data and status params.
  */
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

  /**
  * User registration, or more like 'username' reservation with password
  *
  * @method registerUser
  * @param {Object} whole User object from socket, needs to have id, name, group, and pass (if any)
  * @return {Object} object with data and status params.
  */
  var registerUser = function(o){
    var errors = validateNewUsername(o);
    
    if(errors.length > 0){
      return { status: 'fail', data: errors };
    }else{
      // Store credentials
      var newCreds = credentials.storeCreds(o.name, o.group, o.pass);
      var newGuy = new User(o.id, o.name, o.group, o.pass);
      _registered.push(newGuy);
      
      return {status: 'ok', data: newGuy};
    }
  }

  /**
  * Login registered user. 
  *
  * @method loginUser
  * @param {Object} whole User object from socket, needs to have id, name, and pass
  * @return {Object} object with data and status params. Data can provide errors or new User object
  */
  var loginUser = function(o){
    var errors = [];

    // Prevent user from loging in twice
    for(var i=0,j=_online.length; i<j; i++){
      if( o.name == _online[i].name ){
        errors.push("USER_NAME_ALREADY_ONLINE");
      }
    };

    // find if user exists in registered list
    var found = find( {name:o.name , where:'registered'} );
    var user = found.user;

    if(found !== false){
      if(user.pass !== o.pass){
        errors.push("USER_PASS_INCORRECT");
      }
    }else{
      errors.push("USER_NAME_NOT_REGISTERED");
    }

    if(errors.length > 0){
      return { status: 'fail', data: errors };
    }else{
      var newGuy = new User(o.id, user.name, user.group);
      _online.push(newGuy);
      
      return {status: 'ok', data: newGuy };
    }
  }

  /**
  * Kicks user from chat. It can be called manually by mod or admin
  * but it's also used when user disconnects from socket 
  *
  * @method kickUser
  * @param {Number} ID of user to kick
  * @return {Object} object with data and status params. Data can provide errors or new User object
  */
  var kickUser = function(id){
    //TODO: Return error if ID wasn't found! (kicked too late?)
    for(var i = _online.length - 1; i >= 0; i--) {
      if(_online[i].id === id) {
        _online.splice(i, 1);
        //delete _list[i];
      }
    }
    return {status: 'ok'}
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

  /**
  * Look for a given user in _registered or _online tables
  *
  * @method find
  * @param {Object} object with parameters 'byWhat' (name or id), 'where' (online, registered or everywhere), and strings that we're looking for: name or id.
  * @return {Object} object with foundBy, foundIn and user object
  */
  var find = function(o){
    var found = false;
    var where = (typeof o.where !== 'undefined') ? o.where : 'everywhere';
    var byWhat = 'name';
    if(typeof o.name !== 'undefined'){
      byWhat = 'name';
    }else if(typeof o.id !== 'undefined'){
      byWhat = 'id'
    }

    /*
    console.log('where',where)
    console.log('byWhat',byWhat)
    */

    if(where === 'everywhere' || where === 'online')
      for(var i = _online.length - 1; i >= 0; i--) {
        if(_online[i][byWhat] === o[byWhat]) {
          found = { foundBy: byWhat, foundIn: 'online', user: _online[i] };
        }
      }

    if(where === 'everywhere' || where === 'registered')
      for(var i = _registered.length - 1; i >= 0; i--) {
        if(_registered[i][byWhat] === o[byWhat]) {
          found = { foundBy: byWhat, foundIn: 'registered', user: _registered[i] };
        }
      }

    /*
    console.log("USER.FIND: looging for:", o)
    console.log("USER.FIND: found:", found);
    console.log("USER.REGISTERED:",_registered);
    console.log("USER.ONLINE:",_online);
    */

    return found;
  }

  return {
    list: _online,
    online: _online,
    registered: _registered,

    addUser: addUser,
    registerUser: registerUser,
    loginUser: loginUser,
    kickUser: kickUser,
    changeName: changeName,
    find: find
  };
}());

module.exports = users;
