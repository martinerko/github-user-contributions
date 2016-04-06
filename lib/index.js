/*!
 * github-user-contributions
 * Copyright(c) 2016 martinerko <martinerko@gmail.com>
 * MIT Licensed
 */

module.exports = {

  /**
   * API
   *
   * @param  {String} client_id     OAuth2 Key
   * @param  {String} client_secret OAuth2 Secret
   * @return {Object}
   * @api public
   */

  client: function(client_id, client_secret) {
    var client = require("./client").apply(null, arguments);
    var contributions = require("./contributions")(client);

    return {
      commits: contributions.commits
    };
  }
};
