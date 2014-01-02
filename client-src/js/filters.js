/* Filters */

app.filter('interpolate', function (version) {
  return function (text) {
    return String(text).replace(/\%VERSION\%/mg, version);
  }
});
app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});
