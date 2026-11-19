# Workflow templates

Three n8n workflows built on the Auto.dev node. Each was run on 17 November 2026 with n8n 2.47.7 and `n8n-nodes-autodev` 0.1.0; the market alert was rebuilt and run again on 19 November.

| Workflow | File | Auto.dev plan | Requests per run |
| --- | --- | --- | --- |
| Deal and price drop alerts in Slack for one specific car | [car-market-alert-in-slack.json](car-market-alert-in-slack.json) | Free | 1 per check, 1 more when a listing is new, 1 a day for price drops |
| Deal sheet from a VIN | [vehicle-deal-sheet-from-a-vin.json](vehicle-deal-sheet-from-a-vin.json) | Growth | 4 |
| License plate check-in with open recalls | [license-plate-check-in-with-open-recalls.json](license-plate-check-in-with-open-recalls.json) | Scale | 2 |

## Use one

1. Install the Auto.dev node. It is a verified community node, so on n8n Cloud or self-hosted n8n an owner or admin can open the nodes panel, search for Auto.dev and select **Install**. On self-hosted n8n you can also use **Settings**, then **Community Nodes**, and enter `n8n-nodes-autodev`.
2. Download a file from this folder.
3. In a new workflow, open the menu and choose **Import from File**.
4. Open each Auto.dev node and pick your **Auto.dev API** credential. The market alert also needs a Slack credential and a channel, and its **Create the market log** node has to be run once to add the data table it uses. It saves every new listing to that table, posts the ones priced no more than $500 over the market average to Slack as a card (photo, price, mileage, VIN and a button to the listing), and once a day posts any logged car whose price has dropped.

The files hold no credentials. The yellow note in each workflow explains how it works and what to change.
