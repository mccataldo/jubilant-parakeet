// this will use closures
// the outer function will be postRequestMaker
// that will take the request body object as the argument
// and return the function to accept more arguments
// for example
// function getToken = postRequestMaker ()

function postRequestMaker (path, body) {
    function postRequest () {
      // this should make a request given the path and body variables
      // it currently does not return anything, hence the uncommented
      // code that follows
      //
      // var http = require("https");
      //
      // var options = {
      //   "method": "POST",
      //   "hostname": "someAPIhost.com",
      //   "port": null,
      //   "path": path,
      //   "headers": {
      //     "content-type": "application/json",
      //     "authorization": "sometoken",
      //     "cache-control": "no-cache"
      //   }
      // };
      // // make the http request
      // var req = http.request(options, function (res) {
      //   var chunks = [];
      //
      //   res.on("data", function (chunk) {
      //     chunks.push(chunk);
      //   });
      //
      //   res.on("end", function () {
      //     var b = Buffer.concat(chunks);
      //     console.log(b.toString());
      //   });
      // });
      // // where the incoming JSON request body 'body' would go:
      // req.write(JSON.stringify(body));
      //
      // req.end();
      responseBody = "this is your response"
      var inputMessage = "here is what you gave: \n"
      var pathMessage = "the path: " + path + "\n"
      var bodyMessage = "and the request body: " + JSON.stringify(body) + "\n"
      var outputMessage = "and here is what you get: \n"
      return inputMessage + pathMessage + bodyMessage + outputMessage + responseBody;
    }
    // we'll pretend the above returns the response of the request
    // below we are returning the function postRequest
    return postRequest;
}

/// example usage

var getToken = postRequestMaker ('/api/login', {'username': 'user', 'password':'password'})
// getToken now contains the request with the proper path and request body to get a token
// now to get a token:
getToken();

// in another file like app.js:
//var util = require('requestclosure.js')

//var getToken = util.postRequestMaker ('/api/login', {'username': 'user', 'password':'password'})


// can I put a closure in another closure?

//var loginRequest = postRequestMaker ('api/login', object)

function tokenGetter (username, password) {

// the function invoked below should return a function postRequest
    var login = postRequestMaker('/api/login', {'username': username, 'password': password});



  // return function that will ta
  return login;
}

// usage:
// create a function that will get the admin's token by passing in the admin's user and pass
var getAdminToken = tokenGetter('user','pass');
// then call will return the token
console.log(getAdminToken());
