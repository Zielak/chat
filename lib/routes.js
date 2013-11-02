
function empty(o) {
  for(var i in o) 
    if(o.hasOwnProperty(i))
      return false;

  return true;
}

module.exports.set = function(app, io, users){
  // copy your routes listed in your app.js directly into here
  app.get("/", function(req, res){
    res.render("page");
  });
  
  /*
   * /user
   * Adds new user, requires parameters
   */
  /*app.get("/user", function(req, res){
    var name = req.query.name;
    var reply = {
      status: 'ok',
      text: '',
      name: name
    };
    
    if( !empty(req.query) ){
      
    reply.username = name;
    
    }else{
      reply.status = 'fail';
      reply.status = 'Pusty request';
    }
    
    res.header('Content-Type', 'application/json');
    res.header('Charset', 'utf-8');
    res.json(reply);
  });
  
  * DELETED, we've got authorize
  * */
  
  
  /*
   * /users
   * List connected users and their properties
   */
  app.get("/users", function(req, res){
    var clients = io.sockets.clients();
    var users = [];
    
    for(var i=0; i < clients.length; i++){
      users.push({
        id: clients[i].id,
        storeData: clients[i].store.data
        //name: clients[i].get('name')
      });
    }
    
    var reply = {
      users: users
    };
    
    res.header('Content-Type', 'application/json');
    res.header('Charset', 'utf-8');
    res.json(users);
  })
}