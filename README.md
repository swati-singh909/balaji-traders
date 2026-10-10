# Balaji Traders – battery shop website

Phone-first website for Balaji Traders. Customers browse batteries and order on
WhatsApp. There is no backend: products and prices come from a Google Sheet
that the site reads every time it opens.

- **Stack:** React 18 + Vite, PapaParse (reads the sheet), plain CSS
- **Hosting:** Cloudflare Pages (free `*.pages.dev` address)
- **Orders:** WhatsApp click-to-chat links with the order already typed

## Pages

| Link | Page |
|---|---|
| `/#/` | Home: top section + All batteries (tabs: All, Inverter Battery, Solar Setup, Car, Bike, Truck, Tractor) |
| `/#/battery/<name>` | Battery details: choose Ah, old battery yes/no, fitting place, area → Order on WhatsApp |
| `/#/service` | Doorstep service request in 3 steps → Send on WhatsApp |
| `/#/partner` | Partner program for garages and electricians → Send on WhatsApp |

## 1. Set up the Google Sheet

Create a Google Sheet with two tabs. Start from the sample files in
`public/data/` (File → Import → Upload in Google Sheets).

### Tab `products`: one row per battery size

| column | what to write | example |
|---|---|---|
| `category` | `inverter`, `solar`, `car`, `bike`, `truck` or `tractor` | `inverter` |
| `brand` | brand name | `Epic Power` |
| `model` | model name | `Tall Tubular` |
| `ah` | capacity (number only) | `150` |
| `price` | selling price (number only) | `11500` |
| `exchange_price` | price after old-battery exchange (optional) | `10500` |
| `warranty_months` | warranty (optional) | `60` |
| `image` | file name in `public/images/`, or a full image link | `epic-power-tall-tubular.webp` |
| `show` | `no` hides the battery (empty = show) | `yes` |
| `highlight` | `yes` puts it first with a "Top pick" badge | `yes` |
| `sort` | order in the list, smaller first (optional) | `1` |
| `note` | short extra line on the details page (optional) | `Best for 2 BHK` |

Each row is its own card, named by brand + Ah: `Epic Power` + `200` shows as
**Epic Power 200 Ah**, with the model as a small line under it. A row without
an `ah` shows as brand + model. Leave `price` empty to show "Price on WhatsApp".

### Tab `settings`: two columns, `key` and `value`

| key | example |
|---|---|
| `shop_name` | `Balaji Traders` |
| `whatsapp_number` | `919876543210` (country code + number, digits only) |
| `phone_number` | `+919876543210` |
| `fitting_time` | `2 hours` (shows "Fitted at your door in 2 hours") |
| `address` | shop address |
| `hours` | `9 AM – 9 PM, all days` |
| `areas` | `Area 1, Area 2, Area 3` (comma separated) |
| `maps_url` | Google Maps link to the shop |

### Publish it

In Google Sheets: **File → Share → Publish to web**. Choose the `products` tab and
**Comma-separated values (.csv)**, publish, and copy the link. Do the same for the
`settings` tab.

Only selling prices belong in this sheet: anyone with the link can read it.
Never add purchase cost, margins or customer details.

## 2. Run it on your computer

```bash
npm install
cp .env.example .env   # paste the two CSV links into .env
npm run dev            # opens http://localhost:5173
```

Without a `.env`, the site uses the sample data in `public/data/`.

## 3. Put it online for free (Cloudflare Pages)

1. Push this repository to GitHub.
2. In Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**, pick this repo.
3. Build settings: framework **Vite** (or none), build command `npm run build`,
   output folder `dist`.
4. **Environment variables:** add `VITE_PRODUCTS_CSV_URL` and `VITE_SETTINGS_CSV_URL`
   with your two CSV links.
5. Choose the project name, which becomes the free address,
   e.g. `balajitraders.pages.dev`.

Every push to `main` updates the site. Price changes in the sheet do **not**
need a new deploy. A new deploy is only needed for design changes, new photos
or new sheet links.

## Adding photos

Put the image in `public/images/` (WebP or JPG, about 560 px wide, background
removed if possible) and write its file name in the sheet's `image` column.

## Good to know

- Google refreshes the published CSV with a short delay, so a price change can take a
  few minutes to appear.
- The site remembers the last prices on each phone and shows them instantly,
  then refreshes from the sheet. If the sheet can't be reached, the last prices stay.
- Customers can add the site to their home screen (it works as an app).
- Link previews on WhatsApp show the shop's picture. Per-battery previews would
  need a server, which this setup avoids on purpose.
