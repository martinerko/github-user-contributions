/*!
 * github-user-contributions - client
 * Copyright(c) 2016 martinerko <martinerko@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var axios = require("axios");

/**
 * Provides basic client API for authentication and requests
 *
 * @param  {String} client_id     OAuth2 Key
 * @param  {String} client_secret OAuth2 Secret
 * @return {Object}
 * @api public
 */

module.exports = function client(client_id, client_secret) {
  if (arguments.length < 2) {
    throw new Error("client_id and client_secret are missing");
  }

  var apiUrl = "https://api.github.com";

  /**
   * Make a request against Github api
   * @param  {String} path
   * @return {Promise}
   * @api public
   */

  this.request = function(path) {
    var appender = ~path.indexOf("?") ? (~path.indexOf("=") ? "&" : "?") : "?";
    var svc = apiUrl + path + appender + "client_id=" + client_id + "&client_secret=" + client_secret;
    return axios.get(svc);
  };

  /**
   * Make a request against Github API that can be used to test credentials
   * @return {Promise}
   * @api public
   */

  this.authenticate = function() {
    return this.request("");
  };

  return this;
};
