module.exports = function Reply(){
  this.status = arguments[0] || "ok";
  this.info = arguments[1] || "";
}