// Where the website reads its data from.
// After you publish your Google Sheet (File → Share → Publish to web → CSV),
// put the two links in a `.env` file (see `.env.example`) or in the
// Cloudflare Pages environment variables. Until then the sample files in
// /public/data are used.
export const PRODUCTS_CSV_URL =
  import.meta.env.VITE_PRODUCTS_CSV_URL || '/data/products.csv';
export const SETTINGS_CSV_URL =
  import.meta.env.VITE_SETTINGS_CSV_URL || '/data/settings.csv';

// Tabs on the home page, in this order. `id` must match the `category`
// column in the sheet.
export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'inverter', label: 'Inverter Battery', short: 'Inverter battery' },
  { id: 'solar', label: 'Solar Setup', short: 'Solar setup' },
  { id: 'car', label: 'Car', short: 'Car battery' },
  { id: 'bike', label: 'Bike', short: 'Bike battery' },
  { id: 'truck', label: 'Truck', short: 'Truck battery' },
  { id: 'tractor', label: 'Tractor', short: 'Tractor battery' },
];

// Used only if the settings sheet is missing a value.
export const DEFAULT_SETTINGS = {
  shop_name: 'Balaji Traders',
  whatsapp_number: '',
  phone_number: '',
  fitting_time: '',
  address: '',
  hours: '',
  areas: '',
  maps_url: '',
};
