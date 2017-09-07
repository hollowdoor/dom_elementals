var fs = require('fs');

function getFileUrl(str) {
  var pathName = fs.absolute(str).replace(/\\/g, '/');
  // Windows drive letter must be prefixed with a slash
  if (pathName[0] !== "/") {
    pathName = "/" + pathName;
  }
  return encodeURI("file://" + pathName);
}


console.log('Loading a web page');
var page = require('webpage').create();
var url = getFileUrl('index.html');

page.open(url, function (status) {
  //Page is loaded!
  console.log(status)
  phantom.exit();
});
