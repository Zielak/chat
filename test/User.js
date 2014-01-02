var
  should = require('should'),
  //app = require('../app.js'),
  app = require('../app.js'),
  users = require('../controllers/User.js'),
  config = require('../config'),
  credentials = require('../credentials')
;

describe('User', function(){

  /*beforeEach(function(){
    // clear users or something
  })*/

  var u, find, first, drugi;

  it('module should be created', function(){
    users.should.be.ok;
  })

  it('should reject empty call',function(){
    u = users.addUser();
    u.status.should.equal('fail');
    u.data.should.include('USER_EMPTY_CALL');
  })

  it('should reject empty or short username',function(){
    u = users.addUser({name:''});
    u.status.should.equal('fail');
    u.data.should.include('USER_NAME_TOO_SHORT');
  })

  it('should reject restricted usernames', function(){
    var restricted = config.restricted.userNames;
    for (var i = restricted.length - 1; i >= 0; i--) {
      u = users.addUser({name: restricted[i]});
      u.status.should.equal('fail');
      u.data.should.include('USER_NAME_RESTRICTED');
    };
  })

  it('should reject registered usernames', function(){
    for (var i = credentials.length - 1; i >= 0; i--) {
      u = users.addUser({name: credentials[i].name});
      u.status.should.equal('fail');
      u.data.should.include('USER_NAME_REGISTERED');
    };
  })
  
  it('should add First user', function () {
    u = users.addUser({name: 'First'});
    should(u.status).equal('ok');
    first = u.data;
  });

  it('should reject already online usernames',function(){
    var u = users.addUser({name: first.name});
    u.status.should.equal('fail');
    u.data.should.include('USER_NAME_ALREADY_ONLINE');
  })

  it('should find "First" in online', function () {
    find = users.find({name:'First'})
    should(find.foundBy).equal('name');
    should(find.foundIn).equal('online');
  });

  it('should return first user "First"', function(){
    users.list[0].should.equal(first);
  })

  it('should find "Admin" in registered', function () {
    find = users.find({name:'Admin'})
    find.foundBy.should.equal('name');
    find.foundIn.should.equal('registered');
  });

  it('should kick user by ID', function () {
    u = users.addUser({name:'kickMe'}).data;
    users.find({name:u.name}).should.be.ok;
    users.kickUser(u.id);
    users.find({name:u.name}).should.be.false;
  });
  

})

