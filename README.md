# n8n-nodes-autodev: the Auto.dev node for n8n

The official [Auto.dev](https://www.auto.dev) community node for [n8n](https://n8n.io/). It adds vehicle data to your workflows: decode a VIN, search new and used car listings from US dealers, check safety recalls, turn a license plate into a VIN, and calculate loan payments, taxes and cost of ownership.

It has 13 operations, a trigger that starts a workflow when a new listing matches your search, and it works as a tool for n8n's AI Agent node.

[Installation](#installation) ·
[Operations](#operations) ·
[Credentials](#credentials) ·
[Compatibility](#compatibility) ·
[Usage](#usage) ·
[Questions](#questions) ·
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation. The package name is `n8n-nodes-autodev`.

In n8n: **Settings**, then **Community Nodes**, then **Install**, and enter `n8n-nodes-autodev`.

## Operations

### Auto.dev

| Resource | Operation | What it returns | API docs |
| --- | --- | --- | --- |
| VIN | Decode | Year, make, model, trim, engine, drive, transmission and fuel for a VIN | [VIN Decode](https://docs.auto.dev/v2/products/vin-decode) |
| VIN | Get Specifications | Engine, measurements, features, colors and options | [Specifications](https://docs.auto.dev/v2/products/specifications) |
| VIN | Get Recalls | Every safety recall issued for the vehicle | [Vehicle Recalls](https://docs.auto.dev/v2/products/vehicle-recalls) |
| VIN | Get Open Recalls | Only the recalls that have not been repaired | [Open Recalls](https://docs.auto.dev/v2/products/open-recalls) |
| VIN | Get Build Data | The factory build: exact trim, colors, options and packages | [OEM Build Data](https://docs.auto.dev/v2/products/oem-build-data) |
| Listing | Get Many | New and used dealer listings that match your filters | [Vehicle Listings](https://docs.auto.dev/v2/products/vehicle-listings) |
| Listing | Get | The dealer listing for one VIN | [Vehicle Listings](https://docs.auto.dev/v2/products/vehicle-listings) |
| Listing | Get Photos | The retail photos of a vehicle | [Vehicle Photos](https://docs.auto.dev/v2/products/vehicle-photos) |
| Plate | Get VIN | The VIN, year, make and model behind a US license plate | [Plate to VIN](https://docs.auto.dev/v2/products/plate-to-vin) |
| Finance | Get Payments | Monthly payment, loan amount, taxes and fees | [Vehicle Payments](https://docs.auto.dev/v2/products/vehicle-payments) |
| Finance | Get Interest Rates | Used-auto loan rates for 36 to 84 month terms | [Interest Rates](https://docs.auto.dev/v2/products/interest-rates) |
| Finance | Get Taxes and Fees | Sales tax and government fees for a sale in a ZIP code | [Taxes and Fees](https://docs.auto.dev/v2/products/taxes-fees) |
| Finance | Get Ownership Cost | Five-year cost to own | [Total Cost of Ownership](https://docs.auto.dev/v2/products/total-cost-ownership) |

**Listing filters:** make, model, year, trim, body style, fuel, transmission, price, mileage, condition (new or used), certified pre-owned, state, ZIP code with distance, and dealer ID. Text filters take several values separated by commas (`Ford,Chevrolet`). Year, price and mileage take a range (`2018-2020`, `10000-20000`).

**Simplify:** Decode, Listing Get and Listing Get Many return ten fields by default. Turn off **Simplify** to get the full response.

### Auto.dev Trigger

| Event | When it starts the workflow |
| --- | --- |
| New Listing | A vehicle listing that matches your filters appears for the first time |

The trigger polls the listings search, newest first, with the same filters as Listing Get Many. The first poll records what is already listed and emits nothing, so your workflow only receives listings that appear after you activate it.

Each poll is one request to the Auto.dev API and counts toward your plan. Set the poll time to match how quickly you need new listings.

## Credentials

You need an Auto.dev account and an API key.

1. Sign up at [auto.dev](https://www.auto.dev).
2. Open [API keys](https://www.auto.dev/dashboard/api-keys) in the dashboard and create a key.
3. In n8n, create a new **Auto.dev API** credential and paste the key into **API Key**.

The key is sent as `Authorization: Bearer <key>` on every request. Each n8n user connects their own Auto.dev account; requests are billed to the account that owns the key.

Which operations you can call depends on your Auto.dev plan. See [pricing](https://www.auto.dev/pricing). If an operation is not in your plan, the node tells you so.

## Compatibility

Requires n8n 2.46.1 or later. Tested with n8n 2.47.

## Usage

### Decode every VIN in a spreadsheet

1. **Google Sheets** node: read the rows that hold your VINs.
2. **Auto.dev** node: Resource **VIN**, Operation **Decode**, and set **VIN** to the VIN column.
3. **Google Sheets** node: write year, make, model and trim back to each row.

### Get a message when a matching car is listed

1. **Auto.dev Trigger** node: add filters, for example Make `Toyota`, Model `Tacoma`, Price `20000-35000`, ZIP Code `33132`, Distance `100`.
2. **Slack** node (or email): send the year, trim, price, mileage, dealer and listing address from each new listing.

### Check a fleet for open recalls every week

1. **Schedule Trigger** node: once a week.
2. A node that returns your fleet's VINs.
3. **Auto.dev** node: Resource **VIN**, Operation **Get Open Recalls**.
4. **If** node: continue when `openRecalls` is greater than 0, then notify the fleet manager.

### Let an AI agent look up vehicles

Connect the **Auto.dev** node to an **AI Agent** node as a tool. The agent can then decode a VIN, search listings or check recalls while it answers.

## Questions

### How do I decode a VIN in n8n?

Install `n8n-nodes-autodev`, add the **Auto.dev** node, choose Resource **VIN** and Operation **Decode**, and enter a 17-character VIN. The node returns the year, make, model, trim, body, engine, drive, transmission and fuel.

### Is there an n8n node for car listings?

Yes. The Auto.dev node's **Listing: Get Many** operation searches new and used vehicle listings from dealers across the United States, with filters for make, model, year, price, mileage, location and dealer.

### How do I get an alert in n8n when a car is listed for sale?

Use the **Auto.dev Trigger** node with the **New Listing** event. Add filters for the car you want, then connect Slack, email or any other node. The workflow runs once for each listing that appears after you activate it.

### Can an n8n AI agent look up vehicle data?

Yes. Connect the Auto.dev node to n8n's **AI Agent** node as a tool. Outside n8n, AI assistants and coding agents can connect to Auto.dev's hosted MCP server at `https://mcp.auto.dev/mcp` ([MCP quickstart](https://docs.auto.dev/v2/mcp-quickstart)).

### How do I check a vehicle for recalls in n8n?

Choose Resource **VIN** and Operation **Get Open Recalls** for the recalls that have not been repaired, or **Get Recalls** for every recall issued for the vehicle.

### How do I convert a license plate to a VIN in n8n?

Choose Resource **Plate** and Operation **Get VIN**, then enter the two-letter state and the plate number.

### What does it cost?

The node is open source under the MIT license. Calls are billed by Auto.dev to the account that owns the API key, at that account's plan rates. See [Auto.dev pricing](https://www.auto.dev/pricing).

## Resources

- [Auto.dev](https://www.auto.dev)
- [Auto.dev API documentation](https://docs.auto.dev) and [getting started guide](https://docs.auto.dev/v2/getting-started)
- [Auto.dev OpenAPI file](https://docs.auto.dev/openapi.json)
- [Auto.dev pricing](https://www.auto.dev/pricing)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)

## License

[MIT](LICENSE.md)
