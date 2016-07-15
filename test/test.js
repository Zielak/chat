
var assert = require("assert");
var 
  app = require('../app.js'),
  users = require('../controllers/User'),
  config = require('../config'),
  credentials = require('../controllers/Credentials'),
  db = require('../controllers/Database');

console.log('IN test');

describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
});


describe('Database', function(){
  it('should insert test log', function(){
    console.log('in Database test');
    assert(db.logs.insert({ woot: 'foo' }));
  })
})



console.log('OUT tests');