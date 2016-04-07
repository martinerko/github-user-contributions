var github = require("../lib");
+// set you client id and client secret
+// you can register you app here
+// https://github.com/settings/applications/new
+var client_id = "your_client_id";
+var client_secret = "your_client_secret";
+var client = github.client(client_id, client_secret);

client.commits("martinerko", ["github-user-contributions", "react-storybook", "expressjs.com"], ["master","gh-pages"], function(err, data) {
  if (err) {
    return console.error(err);
  }
  data.forEach(printRepositoryCommits);
});

function printRepositoryCommits(branches) {
  var response = {
    repository: "", // name of repository is stored under each branch object
    branches: [], // list of branches where commits occured
    commits: []
  };

  var commitsTree = {};
  branches.forEach(function(branch) {
    response.repository = branch.repository;
    var commits = branch.commits;

    if (commits.length) {
      response.branches.push(branch.branch);
      commits.forEach(function(c) {
        var sha = c.sha;

        // we won't log duplicated commits that appears on another branch
        // neither if they are merge commits
        if (!(commitsTree.hasOwnProperty(sha) || c.parents.length > 1)) {
          var commit = c.commit;
          commitsTree[sha] = {
            sha: sha,
            author: commit.author.name,
            date: commit.author.date,
            message: commit.message,
            url: commit.url
          };
        }
      });
    }
  });

  var shas = Object.keys(commitsTree);
  if (shas.length) {
    response.commits = shas.map(function(sha) {
      return commitsTree[sha];
    });
    console.log(response);
  }
}
