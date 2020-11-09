const isValidRepo = repo => /^[^/]+\/[^/]+$/.test(repo);

module.exports = {
  key: 'file',

  noun: 'File',
  display: {
    label: 'Create File',
    description: 'Creates a new file in a repository.'
  },

  operation: {
    inputFields: [
      async (z, bundle) => {
        const response = await z.request('https://api.github.com/user/repos');
        return [
          {
            key: 'repo',
            label: 'Repo',
            required: true,
            choices: response.data.reduce((acc, repo) => {
              acc[repo.full_name] = repo.full_name;
              return acc;
            }, {}),
            altersDynamicFields: true,
          }
        ];
      },
      async (z, bundle) => {
        let choices = [];

        if (isValidRepo(bundle.inputData.repo)) {
          const response = await z.request(`https://api.github.com/repos/${bundle.inputData.repo}/branches`);
          choices = response.data.reduce((acc, branch) => {
            acc[branch.name] = branch.name;
            return acc;
          }, {});
        }

        return [
          {
            key: 'branch',
            label: 'Branch',
            required: true,
            choices,
          }
        ];
      },
      {
        key: 'path',
        label: 'Path including file name',
        required: true,
      },
      {
        key: 'content',
        label: 'File contents',
        type: 'text',
        required: true,
      },
      {
        key: 'message',
        label: 'Commit message',
        required: false,
      },
    ],

    perform: async (z, bundle) => {
      if (!isValidRepo(bundle.inputData.repo)) {
        throw new z.errors.Error(
          'That repo name doesn\'t look right. Should be in the format owner/reponame',
        );
      }

      const response = await z.request({
        method: 'PUT',
        url: `https://api.github.com/repos/${bundle.inputData.repo}/contents/${bundle.inputData.path}`,
        body: {
          branch: bundle.inputData.branch,
          message: bundle.inputData.message || `Add “${bundle.inputData.path.split('/').reverse()[0]}” (via GitHub Plus on Zapier)`,
          content: Buffer.from(bundle.inputData.content).toString('base64'),
        },
      });

      return response.data;
    },

    // outputFields: [],

    sample: {
      "content": {
        "name": "hello.txt",
        "path": "notes/hello.txt",
        "sha": "95b966ae1c166bd92f8ae7d1c313e738c731dfc3",
        "size": 9,
        "url": "https://api.github.com/repos/octocat/Hello-World/contents/notes/hello.txt",
        "html_url": "https://github.com/octocat/Hello-World/blob/master/notes/hello.txt",
        "git_url": "https://api.github.com/repos/octocat/Hello-World/git/blobs/95b966ae1c166bd92f8ae7d1c313e738c731dfc3",
        "download_url": "https://raw.githubusercontent.com/octocat/HelloWorld/master/notes/hello.txt",
        "type": "file",
        "_links": {
          "self": "https://api.github.com/repos/octocat/Hello-World/contents/notes/hello.txt",
          "git": "https://api.github.com/repos/octocat/Hello-World/git/blobs/95b966ae1c166bd92f8ae7d1c313e738c731dfc3",
          "html": "https://github.com/octocat/Hello-World/blob/master/notes/hello.txt"
        }
      },
      "commit": {
        "sha": "7638417db6d59f3c431d3e1f261cc637155684cd",
        "node_id": "MDY6Q29tbWl0NzYzODQxN2RiNmQ1OWYzYzQzMWQzZTFmMjYxY2M2MzcxNTU2ODRjZA==",
        "url": "https://api.github.com/repos/octocat/Hello-World/git/commits/7638417db6d59f3c431d3e1f261cc637155684cd",
        "html_url": "https://github.com/octocat/Hello-World/git/commit/7638417db6d59f3c431d3e1f261cc637155684cd",
        "author": {
          "date": "2014-11-07T22:01:45Z",
          "name": "Monalisa Octocat",
          "email": "octocat@github.com"
        },
        "committer": {
          "date": "2014-11-07T22:01:45Z",
          "name": "Monalisa Octocat",
          "email": "octocat@github.com"
        },
        "message": "my commit message",
        "tree": {
          "url": "https://api.github.com/repos/octocat/Hello-World/git/trees/691272480426f78a0138979dd3ce63b77f706feb",
          "sha": "691272480426f78a0138979dd3ce63b77f706feb"
        },
        "parents": [
          {
            "url": "https://api.github.com/repos/octocat/Hello-World/git/commits/1acc419d4d6a9ce985db7be48c6349a0475975b5",
            "html_url": "https://github.com/octocat/Hello-World/git/commit/1acc419d4d6a9ce985db7be48c6349a0475975b5",
            "sha": "1acc419d4d6a9ce985db7be48c6349a0475975b5"
          }
        ],
        "verification": {
          "verified": false,
          "reason": "unsigned",
          "signature": null,
          "payload": null
        }
      }
    },
  }
};
