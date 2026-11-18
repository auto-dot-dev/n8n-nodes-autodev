# Workflow templates

Three n8n workflows built on the Auto.dev node. Each was run on 17 November 2026 with n8n 2.47.7 and `n8n-nodes-autodev` 0.1.0; the market alert was run again on 18 November with its Slack card.

| Workflow | File | Auto.dev plan | Requests per run |
| --- | --- | --- | --- |
| Market alert in Slack for one specific car | [car-market-alert-in-slack.json](car-market-alert-in-slack.json) | Free | 1 per check, 1 more when a listing is new |
| Deal sheet from a VIN | [vehicle-deal-sheet-from-a-vin.json](vehicle-deal-sheet-from-a-vin.json) | Growth | 4 |
| License plate check-in with open recalls | [license-plate-check-in-with-open-recalls.json](license-plate-check-in-with-open-recalls.json) | Scale | 2 |

## Use one

1. Install the Auto.dev node. It is a verified community node, so on n8n Cloud or self-hosted n8n an owner or admin can open the nodes panel, search for Auto.dev and select **Install**. On self-hosted n8n you can also use **Settings**, then **Community Nodes**, and enter `n8n-nodes-autodev`.
2. Download a file from this folder.
3. In a new workflow, open the menu and choose **Import from File**.
4. Open each Auto.dev node and pick your **Auto.dev API** credential. The market alert also needs a Slack credential and a channel. It posts each new car as a card with its photo, price, mileage, VIN, the difference from the market average and a button to the listing.

The files hold no credentials. The yellow note in each workflow explains how it works and what to change.
