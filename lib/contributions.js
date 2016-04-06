/*!
 * github-user-contributions - contributions
 * Copyright(c) 2016 xyz <xyz@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Promise = require("bluebird");

/**
 * Set of methods to retrieve contribution statistics about particular Github user
 *
 * @param  {Object} client Client object with request and authentication method
 * @return {Object}
 */

module.exports = function contributions(client) {

  if (!client) {
    throw new Error("client entity is required");
  }

  var self = this;
  var request = client.request;

  /**
   * Fetch the list of repositories.
   *
   * @param  {String} login               Github login
   * @param  {String[]} userRepositories  List of repositories specified by user
   * @return {Promise}
   * @api private
   */

  this._getRepositories = function(login, userRepositories) {
    // If user repositories are specfied, do not fetch anything
    if (userRepositories.length) {
      return Promise.resolve(userRepositories);
    }

    // Otherwise we must fetch the data from API
    // https://developer.github.com/v3/repos/#list-user-repositories
    // GET /users/:username/repos
    var path = "/users/" + login + "/repos";
    return request(path)
      .then(function(response) {
        return response.data.map(parseName);
      })
      .catch(function( /*err*/ ) {
        return [];
      });
  };

  /**
   * Fetch the list of branches.
   *
   * @param  {String} login           Github login
   * @param  {String} repository      Name of repository
   * @param  {String[]} userBranches  List of branches specified by user
   * @return {Promise}
   * @api private
   */

  this._getRepositoryBranches = function(login, repository, userBranches) {
    var toObjFormat = function(repository, branches) {
      return {
        repository: repository,
        branches: branches
      };
    };

    // If user branches are specfied, transform and return them back,
    // do not fetch anything
    if (userBranches.length) {
      return Promise.resolve(toObjFormat(repository, userBranches));
    }

    // Otherwise we must fetch the data from API
    // https://developer.github.com/v3/repos/#list-branches
    // GET /repos/:owner/:repo/branches
    var path = "/repos/" + login + "/" + repository + "/branches";
    return request(path)
      .then(function(response) {
        return response.data.map(parseName);
      })
      .then(toObjFormat.bind(null, repository))
      .catch(function( /*err*/ ) {
        return toObjFormat(repository, []);
      });
  };

  /**
   * Fetch the list of commits from all branches from specific repository.
   *
   * @param  {String} login       Github login
   * @param  {String} repository  Name of repository
   * @param  {String[]} branches  List of branches
   * @return {Promise}
   * @api private
   */

  this._getRepositoryCommits = function(login, repository, branches) {
    // For listed branches on given repository find all commits
    return Promise.all(branches.map(self._getBranchCommits.bind(null, login, repository)));
  };

  /**
   * Fetch the list of commits from specific repository and branch.
   *
   * @param  {String} login       Github login
   * @param  {String} repository  Name of repository
   * @param  {String} branch    Name of branch
   * @return {Promise}
   * @api private
   */

  this._getBranchCommits = function(login, repository, branch) {
    var toObjFormat = function(repository, branch, commits) {
      return {
        repository: repository,
        branch: branch,
        commits: commits
      };
    };

    // https://developer.github.com/v3/repos/commits/#list-commits-on-a-repository
    // GET /repos/:owner/:repo/commits
    var path = "/repos/" + login + "/" + repository + "/commits?author=" + login + "&sha=" + branch;
    return request(path)
      .then(function(response) {
        return toObjFormat(repository, branch, response.data);
      })
      .catch(function( /*err*/ ) {
        return toObjFormat(repository, branch, []);
      });
  };

  /**
   * Fetch the list of commits from specified Github login
   * filtered by provided repository(ies) and branch(es).
   *
   * @param  {String} login             Github login
   * @param  {String|String[]|Function} Repositor(ies) or callback
   * @param  {String|String[]|Function} Branch(es) or callback
   * @param  {Function}                 Callback function
   * @return {Promise}
   * @api public
   */

  this.commits = function(login, repository, branch, callback) {
    switch (arguments.length) {
      case 0:
      case 1:
        return callback(new Error("login and callback are missing"));
      case 2:
        callback = repository;
        repository = null;
        break;
      case 3:
        callback = branch;
        branch = null;
        break;
      default:
        break;
    }

    // Try to authenticate a client first,
    // so we can tell the user about incorrect credentials/exceeded limit.
    client.authenticate()
      .then(function() {
        var userRepos = repository ? (typeof repository === "string" ? [repository] : repository) : [];
        var userBranches = branch ? (typeof branch === "string" ? [branch] : branch) : [];

        self._getRepositories(login, userRepos)
          .then(function(repositories) {
            // Find branches for each repository
            return Promise.all(repositories.map(function(repository) {
              return self._getRepositoryBranches(login, repository, userBranches);
            }));
          })
          .then(function(repositoriesWithBranches) {
            // Find commits for each repository and its branches
            return Promise.all(repositoriesWithBranches.map(function(rb) {
              return self._getRepositoryCommits(login, rb.repository, rb.branches);
            }));
          })
          .then(function(commitsPerRepositoryAndBranches) {
            callback(null, commitsPerRepositoryAndBranches);
          })
          .catch(callback);
      })
      .catch(callback);
  };

  return this;
};

/**
 * Returns a value under name attribute of provided object
 * @param  {Object} o
 * @return {}
 * @api private
 */

function parseName(o) {
  return o["name"];
}
