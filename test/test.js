
var assert = require("assert");
var 
  app = require('../app.js'),
  users = require('../controllers/User'),
  config = require('../config'),
  credentials = require('../controllers/Credentials'),
  db = require('../controllers/Database');


describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
});


describe('Database', function(){

  it('should be connected', function(){
    console.log('DATABASE TEST' ,db);
    console.log('DATABASE._state: ', db._state);
  });

  it('should insert test log', function(){
    var collection = db.get('logs');

    collection.insert({ woot: 'foo' }).then(function(docs){
      console.log('added!');
    }).catch(function(err){
      console.log('error D:');
    }).then(function(){
      db.close()
    })
  })
})


