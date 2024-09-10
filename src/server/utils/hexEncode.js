function hexEncode(string) {
  var hex, i;
  var result = "";
  for (i = 0; i < string.length; i++) {
    hex = string.charCodeAt(i).toString(16);
    result += ("000" + hex).slice(-4);
  }
  console.log(result);
  return result;
}

module.exports = hexEncode;
