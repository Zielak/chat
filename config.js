var config = {}


/*
  How does antiFlood work here?
  User's new messages will only be accepted when his timer is below `border`.
  You can use either static or incremental anti flood.
  'static' - user's timer will be set to a `timer` value on each accepted message.
  'incremental' - will add `timer` value on each accepted message.
  User cannot speak when his timer is above `border` value.
  All time units are in miliseconds, which means you can make more
  accurate antiFlood protection (USE WITH CAUTION)
*/
config.antiFlood = {
  type: 'incremental',
  timer: 500,
  border: 5000
}

config.moderation = {
  active: true
}

config.mongo = {
  link: "mongodb://localhost:27017/chatDb"
}

config.user = {
  name: {
    min_length: 2
  }
}

config.restricted = {
  userNames: [
    'server'
  ]
}

config.message = {
  txt: {
    min_length: 2,
    max_length: 100
  }
}

// chatColor should also defined in CSS files
config.groups = {
  "guest": {},
  "mod": {
    chatColor: "#009900"
  },
  "admin": {
    chatColor: "#990000"
  }
}


module.exports = config;
