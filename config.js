var config = {}


/* How does antiFlood work here?
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


config.groups = {
  "guest": {},
  "mod": {
    chatColor: "#006600"
  },
  "admin": {
    chatColor: "#660000"
  }
}
config.credentials = [
  {
    name:  "Zielak",
    pass:  "admin",
    group: "admin"
  }
]

module.exports = config;