# Workflow templates

Three n8n workflows built on the Auto.dev node. Each was run on 17 November 2026 with n8n 2.47.7 and `n8n-nodes-autodev` 0.1.0.

| Workflow | File | Auto.dev plan | Requests per run |
| --- | --- | --- | --- |
| Market alert in Slack for one specific car | [car-market-alert-in-slack.json](car-market-alert-in-slack.json) | Free | 1 per check, 1 more when a listing is new |
| Deal sheet from a VIN | [vehicle-deal-sheet-from-a-vin.json](vehicle-deal-sheet-from-a-vin.json) | Growth | 4 |
| License plate check-in with open recalls | [license-plate-check-in-with-open-recalls.json](license-plate-check-in-with-open-recalls.json) | Scale | 2 |

## Use one

1. Install `n8n-nodes-autodev` in a self-hosted n8n: **Settings**, then **Community Nodes**.
2. Download a file from this folder.
3. In a new workflow, open the menu and choose **Import from File**.
4. Open each Auto.dev node and pick your **Auto.dev API** credential. The market alert also needs a Slack credential and a channel.

The files hold no credentials. The yellow note in each workflow explains how it works and what to change.
