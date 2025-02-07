### example usage in workflow

```yaml
name: Microsoft Teams Pull Request Notification

on:
  pull_request:
    types: [opened]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Notify Teams on Pull Request Open
        uses: amolmt/microsoft-teams-pull-request-notifications@v1
        with:
          teams_webhook_url: ${{ secrets.TEAMS_WEBHOOK_URL }}
```