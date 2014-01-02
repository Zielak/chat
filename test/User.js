var
  should = require('should'),
  //app = require('../app.js'),
  sanitizer = require('sanitizer'),
  moment = require('moment'),
  users = require('../controllers/User.js'),
  config = require('../config')
;

describe('User', function(){

  /*beforeEach(function(){
    // clear users or something
  })*/

  var pierwszy, drugi;

  it('module should be created', function(){
    users.should.be.ok;
  })
  

  describe('.addUser()', function(){
    var o = {

    }

    it('should reject empty username',function(){
      var u = users.addUser({name:''});
      u.status.should.equal('fail');
      u.data[0].should.equal('USER_NAME_TOO_SHORT');
    })

    it('should reject empty call',function(){
      var u = users.addUser();
      u.status.should.equal('fail');
      u.data[0].should.equal('USER_EMPTY_CALL');
    })
    
    /* ADD USER "Pierwszy" */
    pierwszy = users.addUser({name: 'Pierwszy'}).data;

    it('should reject already online usernames',function(){
      var u = users.addUser({name: 'Pierwszy'});
      u.status.should.equal('fail');
      u.data[0].should.equal('USER_NAME_ALREADY_ONLINE');
    })

    it('should reject restricted usernames', function() {
      var u = users.addUser();
    })
    
  })

  describe('.list', function(){
    /*it('should return empty list of users', function(){
      users.list.should.eql([]);
    })*/

    it('should return first user "Pierwszy"', function(){
      users.list[0].should.equal(pierwszy);
    })
  })
})