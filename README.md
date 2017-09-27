# node-mindbodyapi
node.js wrapper for Mindbody REST API used by Mindbody App.


## Installation  

Install via npm  

```
npm install --save mindbodyapi
yarn add mindbodyapi
```

## Basic usage 

```
let MB = require('mindbodyapi');

let mb = new MB(apikey, username, password);

mb.get('rest/class', {
      start: '2017-09-01',
      end: '2017-09-02'
    })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.error(err);
    });
```

## HTTP Functions 

### mb.get(uri, query, headers)

* `uri` : MB endpoint, e.g. `'rest/class'`   
* `query` (optional) object containing query strings  
* `headers` (optional) object containing header strings  

``` 
mb.get('rest/user')
   .then(res => { 
     ...
```

## Options

### Logging

If you want to enable logging to the console of requests (or custom) you can pass in an options object:

```  
let mb = new MB(apikey, username, password, options); 
```  

Where options looks like the following:  

```
let options = {
  logRequests: true,                   // (default: false)
  logFn: mylogger.log.bind(mylogger),  // default: console.log
}
```



## Responses

### Success

Will return the JSON object that Mindbody returns from it's API.

### Fail 

Returns a subclass of `Error` with the following useful properties  

* `err.status` HTTP Status Code
* `err.message` MB Error Message
* `err.code` MB Error Code

## Credit

Thank you to Jon Gregorowicz @jgr3go for his WhenIWork node.js module from which this is based:

https://github.com/jgr3go/node-wheniwork
