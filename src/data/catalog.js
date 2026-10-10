import Papa from 'papaparse';
import {
  PRODUCTS_CSV_URL,
  SETTINGS_CSV_URL,
  DEFAULT_SETTINGS,
} from '../config.js';

const CACHE_KEY = 'bt_catalog_v1';

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toNumber(value) {
  if (value === undefined || value === null) return null;
  const cleaned = String(value).replace(/[^0-9.]/g, '');
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function yes(value) {
  return ['yes', 'y', 'true', '1'].includes(String(value || '').trim().toLowerCase());
}

function imageUrl(name) {
  const value = String(name || '').trim();
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return `/images/${value.replace(/^\/+/, '')}`;
}

async function fetchCsv(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Could not load ${url} (${response.status})`);
  const text = await response.text();
  const parsed = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  });
  return parsed.data;
}

// One sheet row = one battery size. Rows with the same brand + model are
// grouped into one product with several Ah options.
export function buildProducts(rows) {
  const groups = new Map();
  rows.forEach((row, index) => {
    const brand = String(row.brand || '').trim();
    const model = String(row.model || '').trim();
    const category = String(row.category || '').trim().toLowerCase();
    if (!brand && !model) return;
    const showValue = String(row.show ?? '').trim();
    if (showValue && !yes(showValue)) return;

    const slug = slugify(`${brand} ${model}`);
    if (!groups.has(slug)) {
      groups.set(slug, {
        slug,
        brand,
        model,
        name: [brand, model].filter(Boolean).join(' '),
        category,
        image: imageUrl(row.image),
        highlight: false,
        sort: toNumber(row.sort) ?? 1000 + index,
        note: String(row.note || '').trim(),
        variants: [],
      });
    }
    const group = groups.get(slug);
    if (!group.image && row.image) group.image = imageUrl(row.image);
    if (yes(row.highlight)) group.highlight = true;
    if (!group.note && row.note) group.note = String(row.note).trim();

    group.variants.push({
      ah: toNumber(row.ah),
      price: toNumber(row.price),
      exchangePrice: toNumber(row.exchange_price),
      warranty: toNumber(row.warranty_months),
    });
  });

  return [...groups.values()]
    .map((g) => {
      g.variants.sort((a, b) => (a.ah ?? 0) - (b.ah ?? 0));
      const prices = g.variants.map((v) => v.price).filter((p) => p !== null);
      const ahs = g.variants.map((v) => v.ah).filter((a) => a !== null);
      const warranties = g.variants.map((v) => v.warranty).filter((w) => w !== null);
      return {
        ...g,
        minPrice: prices.length ? Math.min(...prices) : null,
        ahs,
        warranty: warranties.length ? Math.max(...warranties) : null,
      };
    })
    .sort((a, b) => Number(b.highlight) - Number(a.highlight) || a.sort - b.sort);
}

export function buildSettings(rows) {
  const settings = { ...DEFAULT_SETTINGS };
  rows.forEach((row) => {
    const key = String(row.key || '').trim().toLowerCase();
    if (key) settings[key] = String(row.value ?? '').trim();
  });
  return settings;
}

export function readCache() {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    /* storage full or blocked: the site still works without the cache */
  }
}

export async function loadCatalog() {
  const [productRows, settingRows] = await Promise.all([
    fetchCsv(PRODUCTS_CSV_URL),
    fetchCsv(SETTINGS_CSV_URL).catch(() => []),
  ]);
  const data = {
    products: buildProducts(productRows),
    settings: buildSettings(settingRows),
    loadedAt: new Date().toISOString(),
  };
  writeCache(data);
  return data;
}
