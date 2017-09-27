'use strict';

let request = require('request-promise');
let _ = require('lodash');

/**
 * Creates an instance of Mindbody
 * @constructor
 * @classdesc A request wrapper class for connecting to the REST API used by the Mindbody App.
 * @description Creates an instance of the Mindbody with the given credentials.
 * @param {string} username Mindbody App Username.
 * @param {string} password Mindbody App Password.
 * @param {string} key Mindbody App API Key, inherts from request module auth. 
 * @param {object} [options] Options params, inherited from request module.
 * @returns {MindbodyApi}
 */
class MindbodyApi {
  constructor(username, password, key, options) {
      options = _.assign({
        logRequests: false,
        logFn: console.log.bind(console)
      }, options);
      
      this.username = username;
      this.password = password;

      this.authkey = key;

      this.authuri = 'https://auth.mindbodyonline.com/issue/oauth2/token';
      this.resturi = 'https://connect.mindbodyonline.com/';
      this.token;
      
      this.config = options;
      this.log = options.logFn;
      this.error = options.errorFn;
  
      this.ready = this.login();
  }

  _request (options, nolog) {
    options = _.merge({
      method: 'GET',
      auth: {
        bearer : this.token || undefined
      },
      json: true
    }, options);

    if (this.config.logRequests && !nolog) {
      this.log(options.method, options.uri, {qs: options.qs, body: options.body});
    }
    
    return request(options)
      .catch(err => {
        throw new MBError(err);
      });
  }

  request(options) {
    return this.ready
    .then(() => {
      return this._request(options);
    });
  }

  get(uri, query, headers) {
    let options = {
      uri: this.resturi + uri,
      qs: query || undefined,
      headers: headers
    };
    return this.request(options);
  }

  login () {
    return this._request({
      method: 'POST',
      uri: this.authuri,
      auth: this.authkey,
      body: {
        username: this.username,
        password: this.password,
        scope : 'urn:mboframeworkapi',
        grant_type : 'password'
      },
      json: true
    },true)
        .then(res => {
          this.token = res.access_token;
    })
  }
}

class MBError extends Error {
  constructor(err) {
    super(err);
    this.status = err.statusCode;
    this.code = err.error.code;
    this.message = `${this.code} - ${err.error.error}`;
  }

  toJSON() {
    return {
      status: this.status,
      code: this.code,
      message: this.message
    };
  }
}

module.exports = MindbodyApi;