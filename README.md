# jubilant-parakeet

- experimenting with closures 
- also will try going semicolon-less, sans double quotes and camelCase only (even in comments)
- less is more, right?

in this experiment we're using closures to create functions that interface with the API like logging in and fetching users tokens
the outer function `postRequestMaker` below will take the URI `path` and request body `body` object as the arguments and return the function `postRequest`
this will enable us to do something like this
 
```
var createAdminUser = postRequestMaker('api/user',{
'username':'Administrator'
'password':'temp_password'
'permissions':'Admin'
})
```
where `createAdminUser` is a *function* that can be invoked later

more examples with explanations to follow this implementation

```
function postRequestMaker (path, body) {
    function postRequest () {
      // this commented code makes a http request
      // it currently does not return anything, hence the uncommented
      // code that follows
      // the arguments 'path' and 'body' are in scope of the inner function
      // and are passed in
      //
      // var http = require('https')
      //
      // var options = {
      //   'method': 'POST',
      //   'hostname': 'someAPIhost.com',
      //   'port': null,
      //   'path': path,
      //   'headers': {
      //     'content-type': 'application/json',
      //     'authorization': 'sometoken',
      //     'cache-control': 'no-cache'
      //   }
      // }
      // // make the http request
      // var req = http.request(options, function (res) {
      //   var chunks = []
      //
      //   res.on('data', function (chunk) {
      //     chunks.push(chunk)
      //   })
      //
      //   res.on('end', function () {
      //     var b = Buffer.concat(chunks)
      //     console.log(b.toString())
      //   })
      // })
      // // where the incoming JSON request body 'body' is passed
      // req.write(JSON.stringify(body))
      //
      // req.end()
      // we'll pretend the above returns the response of the request
      var responseBody = 'this is your response'
      var inputMessage = 'here is what you gave: \n'
      var pathMessage = 'the path: ' + path + '\n'
      var bodyMessage = 'and the request body: ' + JSON.stringify(body) + '\n'
      var outputMessage = 'and here is what you get: \n'
      // we're just making sure it all works with verbose output
      // but we're not forcing it!
      // we'll console.log() the invoked function if we want to see it
      return inputMessage + pathMessage + bodyMessage + outputMessage + responseBody
    }

    // below we are returning - the function - 'postRequest'
    // notice we're not invoking it here
    return postRequest
    // instead of declaring 'postRequest' we could also have returned the above
    // and an anonymous function, like 'return function () {...}
}
```
### example usage #1
if our API's endpoint `/login` reponds with a token when you post credentials, we can use the `postRequestMaker` to create a function that gets that token and then we can store this token for future interaction with our API
``` 
var getToken = postRequestMaker ('/api/login', {
  'username': 'user',
  'password':'password'
  }
)
```
`getToken` now contains the function to make the post request request with the proper path `/api/login` and request body to get a token
it's not invoked yet! 
it's just the function contained in `getToken`

now to get a token you invoke it:
 ```
getToken()
```
`console.log()` that bad boy to see it work!

### example usage #2

- contain the closure in a `module.exports` object
- export it as a singleton or instantiate it as `request`
- then in another file like `app.js` or `main.js` (this could be bad practice or even wrong):
```
var post = require('requestclosure.js')
var login = post.request ('/api/login', {
    'username': 'user', 
    'password':'password'
    }
)
```
invoke it to make the request
```
login()
```
### example usage #3
can I use a closure in another closure (create a closure with the original closure)?
```
function tokenGetter (username, password) {

  // the function invoked below should return a function 'postRequest'
  // see 'postRequestMaker' defined at the beginning
  var login = postRequestMaker('/api/login', {
    'username': username, 
    'password': password
    }
)
  // so we're storing it in 'login'
  // then return 'login' - a function
  return login
  // alternatively, we could just 'return postRequestMaker(...)'
}
```
##### here's how this works

 in `getAdminToken` below we're going to store the function that will get an admin token using `tokenGetter` which contains `login` (you need to login to get a token back) 
 the `login` function will interface with our API so in this case the consumer of `tokenGetter` only needs credentials and is not exposed to the `/login` endpoint
    ###### pretty sweet

we'll ultimately get the admin's token by passing in the admin's user and pass
```
var getAdminToken = tokenGetter('user','pass')
```
then calling it will return the token
```
console.log(getAdminToken())
```
ok so we're not likely getting the token because most API repsonses are not going to return a token as a string by itself when performing a POST request to a `/login` or similar endpoint but instead an object that would contain the token among other values

normally we would need to parse the token out of the JSON repsonse
