# n8n-nodes-autodev

This is an n8n community node. It lets you use [Auto.dev](https://www.auto.dev) in your n8n workflows.

Auto.dev is a vehicle data API: decode a VIN, search new and used dealer listings across the United States, check recalls, look up a license plate, and calculate payments, taxes and cost of ownership.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation. The package name is `n8n-nodes-autodev`.

## Operations

### Auto.dev

| Resource | Operation | What it returns |
| --- | --- | --- |
| VIN | Decode | Year, make, model, trim, engine, drive, transmission and fuel for a VIN |
| VIN | Get Specifications | Engine, measurements, features, colors and options |
| VIN | Get Recalls | Every safety recall issued for the vehicle |
| VIN | Get Open Recalls | Only the recalls that have not been repaired |
| VIN | Get Build Data | The factory build: exact trim, colors, options and packages |
| Listing | Get Many | New and used dealer listings that match your filters |
| Listing | Get | The dealer listing for one VIN |
| Listing | Get Photos | The retail photos of a vehicle |
| Plate | Get VIN | The VIN, year, make and model behind a US license plate |
| Finance | Get Payments | Monthly payment, loan amount, taxes and fees |
| Finance | Get Interest Rates | Used-auto loan rates for 36 to 84 month terms |
| Finance | Get Taxes and Fees | Sales tax and government fees for a sale in a ZIP code |
| Finance | Get Ownership Cost | Five-year cost to own |

**Listing filters:** make, model, year, trim, body style, fuel, transmission, price, mileage, condition (new or used), certified pre-owned, state, ZIP code with distance, and dealer ID. Text filters take several values separated by commas (`Ford,Chevrolet`). Year, price and mileage take a range (`2018-2020`, `10000-20000`).

**Simplify:** Decode, Listing Get and Listing Get Many return ten fields by default. Turn off **Simplify** to get the full response.

The node can be used as a tool by n8n's AI Agent node.

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

Requires n8n 2.46.1 or later.

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

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Auto.dev API documentation](https://docs.auto.dev)
- [Auto.dev OpenAPI file](https://docs.auto.dev/openapi.json)
- [Auto.dev pricing](https://www.auto.dev/pricing)

## License

[MIT](LICENSE.md)
