# github-user-contributions
Unofficial GitHub contributions API implementation for Node.js

This API provides basic methods for retrieving contributions statistics related to Github repositories owned/forked by specified user.

This API uses OAuth Authorization. Before using it, you shall [register your "application"](https://github.com/settings/applications/new) by following steps described here: [https://developer.github.com/v3/oauth_authorizations/#create-a-new-authorization](https://developer.github.com/v3/oauth_authorizations/#create-a-new-authorization).

## Install

Install with npm:

npm install github-user-contributions

## Currently implemented methods

- commits - returns an array of commits grouped by repositories and branches

## Samples

Retrieve commits from all repositories owned/forked by user *martinerko*.

```js
var github = require("github-user-contributions");
var client_id = "your_client_id";
var client_secret = "your_client_secret";
var client = github.client(client_id, client_secret);


client.commits("martinerko", function(err, data) {
  if (err) {
    return console.error(err);
  }
  data.forEach(printRepositoryCommits);
});
```

Retrieve commits only from *github-user-contributions* repository.

```js
client.commits("martinerko", "github-user-contributions", function(err, data) {
  if (err) {
    return console.error(err);
  }
  data.forEach(printRepositoryCommits);
});
```

Retrieve commits from specific repositories, but only from *master* branch.

```js
client.commits("martinerko", ["expressjs.com", "react-storybook"], "master", function(err, data) {
  if (err) {
    return console.error(err);
  }
  data.forEach(printRepositoryCommits);
});
```

Retrieve commits from specific repositories, but only from *master* and *gh-pages* branches.
Please note, the order of repositories/branches is not important.
We will check all specified branches for each specified repository.
```js
client.commits("martinerko", ["expressjs.com", "react-storybook"], ["master", "gh-pages"], function(err, data) {
  if (err) {
    return console.error(err);
  }
  data.forEach(printRepositoryCommits);
});
```

[More examples ...](https://github.com/martinerko/github-user-contributions/tree/master/examples)

## License
(The MIT License)

Copyright (c) 2016 martinerko

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
