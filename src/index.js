const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

async function run() {
  try {
    const teamsWebhookUrl = core.getInput('teams_webhook_url', { required: true });
    const githubToken = core.getInput('github_token');

    const payload = github.context.payload;

    if (!payload.pull_request) {
      core.setFailed('This action only works on pull_request events.');
      return;
    }

    const pullRequest = payload.pull_request;
    const pullRequestNumber = pullRequest.number;
    const pullRequestTitle = pullRequest.title;
    const pullRequestBody = pullRequest.body;
    const pullRequestUrl = pullRequest.html_url;
    const pullRequestAuthor = pullRequest.user.login;

    const message = {
      '@type': 'MessageCard',
      '@context': 'https://schema.org/extensions',
      summary: `New Pull Request: ${pullRequestTitle}`,
      themeColor: '0078D7',
      title: `New Pull Request Opened by ${pullRequestAuthor}`,
      sections: [
        {
          activityTitle: `**${pullRequestTitle}**`,
          activitySubtitle: `PR #${pullRequestNumber} - Author: ${pullRequestAuthor}`,
          activityImage: pullRequest.user.avatar_url,
          facts: [
            {
              name: 'Repository',
              value: payload.repository.name,
            },
          ],
          text: pullRequestBody ? pullRequestBody : 'No description provided.',
        },
      ],
      potentialAction: [
        {
          '@type': 'OpenUri',
          name: 'View Pull Request',
          targets: [{ os: 'default', uri: pullRequestUrl }],
        },
      ],
    };

    try {
      const response = await axios.post(teamsWebhookUrl, message);
      if (response.status !== 200) {
        core.setFailed(`Failed to send message to Teams. Status code: ${response.status}`);
      } else {
        core.info('Successfully sent message to Teams.');
      }
    } catch (error) {
      core.setFailed(`Failed to send message to Teams: ${error}`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
