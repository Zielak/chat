var crypto = require('crypto');
var mongo = require('mongodb').MongoClient;



function Credentials(name, group, pass){
  this.name = name;
  this.salt = Math.round((new Date().valueOf() * Math.random()))+'';
  this.pass = crypto.createHash('sha256').update(pass + this.salt).digest('hex') || false;
  this.group = group || 'guests';
}
Credentials.prototype = {
  constructor: Credentials
}





var credentials = (function () {

  var storeCreds = function(o){
    var creds = new Credentials(o.name, o.group, o.pass);
    var col = mongo.collection('credentials');
    col.insert(creds);

    return { status:'ok', data:creds }
  }


  return {
    storeCreds: storeCreds,

  }
})();

module.exports = credentials;
