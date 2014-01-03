var config = require('../config');
var cdb = require('../config-database');
var format = require('util').format;

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(format('mongodb://%s:%s@%s:%d/%s',cdb.user, cdb.pass, cdb.host, cdb.port, cdb.name), function(err, db) {
  if(err) throw err;

  var creds = db.collection('credentials');

  var docsss = {};

  creds.findOne({name: config.app.admin.name}, function(err, docs){
    docsss = docs;
    if(typeof docs === 'undefined'){
      console.warn("MONGO: Can't find default admin! I\'m gonna create one from config.js");
      creds.insert({
        name: config.app.admin.name,
        pass: config.app.admin.pass,
        group: "admins"
      }, function(err, docs){
        console.log("MONGO: Chat Admin created.");
      })
    }
  });

  console.log(docsss);


  console.log("MONGO: HI, missed me?");
  

/*
  collection.insert({a:2}, function(err, docs) {

    collection.count(function(err, count) {
      console.log(format("count = %s", count));
    });

    // Locate all the entries using find
    collection.find().toArray(function(err, results) {
      console.dir(results);
      // Let's close the db
      db.close();
    });
  });*/
})



module.exports = MongoClient;
