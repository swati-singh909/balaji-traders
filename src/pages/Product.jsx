import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import BottomBar from '../components/BottomBar.jsx';
import Icon from '../components/Icon.jsx';
import { ProductImage, categoryName } from '../components/ProductCard.jsx';
import { useCatalog } from '../data/CatalogContext.jsx';
import { areaList, formatPrice, whatsappLink } from '../lib/contact.js';
import { paths } from '../lib/router.js';

function Choice({ on, onClick, title, sub }) {
  return (
    <button type="button" className={`choice ${on ? 'choice--on' : ''}`} aria-pressed={on} onClick={onClick}>
      <span className="choice__title">{title}</span>
      {sub && <span className="choice__sub">{sub}</span>}
    </button>
  );
}

export default function Product({ slug }) {
  const { products, settings, status } = useCatalog();
  const product = products.find((p) => p.slug === slug);
  const areas = areaList(settings);

  const [variantIndex, setVariantIndex] = useState(0);
  const [exchange, setExchange] = useState(true);
  const [atHome, setAtHome] = useState(true);
  const [area, setArea] = useState('');

  useEffect(() => {
    if (product) document.title = `${product.name} – ${settings.shop_name}`;
    return () => {
      document.title = `${settings.shop_name} – Inverter, Solar, Car & Bike Batteries`;
    };
  }, [product, settings.shop_name]);

  const variant = product?.variants[Math.min(variantIndex, product.variants.length - 1)];
  const shownPrice = variant ? (exchange && variant.exchangePrice !== null ? variant.exchangePrice : variant.price) : null;

  const message = useMemo(() => {
    if (!product) return '';
    const lines = [`Hi ${settings.shop_name}, I want to order:`, `• ${product.name}`];
    if (product.subtitle) lines.push(`• Type: ${product.subtitle}`);
    if (shownPrice !== null && shownPrice !== undefined) lines.push(`• Price on website: ${formatPrice(shownPrice)}`);
    lines.push(`• Old battery exchange: ${exchange ? 'Yes' : 'No'}`);
    lines.push(`• ${atHome ? 'Fitting at my place' : 'I will collect from shop'}`);
    if (area) lines.push(`• Area: ${area}`);
    lines.push('Please confirm price and time.');
    return lines.join('\n');
  }, [product, variant, shownPrice, exchange, atHome, area, settings.shop_name]);

  if (!product) {
    return (
      <>
        <Header title="Battery" backTo={paths.home} />
        <main className="container page">
          {status === 'loading' || status === 'refreshing' ? (
            <p className="muted">Loading…</p>
          ) : (
            <div className="empty">
              <b>This battery isn't listed right now.</b>
              <a className="btn btn--primary" href={paths.home}>See all batteries</a>
            </div>
          )}
        </main>
      </>
    );
  }

  const waHref = whatsappLink(settings.whatsapp_number, message);
  const hasSizes = product.variants.length > 1;

  return (
    <>
      <Header title={product.name} backTo={paths.home} />
      <main className="container page product">
        <div className="product__media">
          <div className="product__img">
            <ProductImage product={product} />
            {product.highlight && <span className="pcard__badge">Top pick</span>}
          </div>
        </div>

        <div className="product__body">
          <div>
            <span className="eyebrow">{categoryName(product.category)}</span>
            <h1 className="product__name">{product.name}</h1>
          </div>

          <div className="chips">
            {product.subtitle && <span className="chip chip--soft">{product.subtitle}</span>}
            {variant?.warranty && <span className="chip chip--soft">{variant.warranty} months warranty</span>}
            {product.note && <span className="chip chip--soft">{product.note}</span>}
          </div>

          <div className="price-box">
            {shownPrice !== null && shownPrice !== undefined ? (
              <>
                <span className="price-box__value">{formatPrice(shownPrice)}</span>
                <span className="muted">
                  {exchange && variant.exchangePrice !== null
                    ? 'with old battery exchange'
                    : exchange
                      ? 'old battery value is reduced at fitting'
                      : 'without exchange'}
                </span>
              </>
            ) : (
              <span className="price-box__ask">Price on WhatsApp</span>
            )}
          </div>

          {hasSizes && (
            <fieldset className="field">
              <legend>1. Choose capacity</legend>
              <div className="sizes">
                {product.variants.map((v, i) => (
                  <button
                    key={`${v.ah}-${i}`}
                    type="button"
                    className={`size ${i === variantIndex ? 'size--on' : ''}`}
                    aria-pressed={i === variantIndex}
                    onClick={() => setVariantIndex(i)}
                  >
                    <span className="size__ah">{v.ah} Ah</span>
                    {v.price !== null && <span className="size__price">{formatPrice(v.price)}</span>}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <fieldset className="field">
            <legend>{hasSizes ? '2.' : '1.'} Do you have an old battery?</legend>
            <div className="choices">
              <Choice on={exchange} onClick={() => setExchange(true)} title="Yes, exchange it" sub="pay less" />
              <Choice on={!exchange} onClick={() => setExchange(false)} title="No old battery" />
            </div>
          </fieldset>

          <fieldset className="field">
            <legend>{hasSizes ? '3.' : '2.'} Where do you want it?</legend>
            <div className="choices">
              <Choice on={atHome} onClick={() => setAtHome(true)} title="Fit at my place" sub="free fitting" />
              <Choice on={!atHome} onClick={() => setAtHome(false)} title="I'll collect" sub="from shop" />
            </div>
          </fieldset>

          {areas.length > 0 && (
            <label className="field">
              <span className="legend">{hasSizes ? '4.' : '3.'} Your area</span>
              <select value={area} onChange={(e) => setArea(e.target.value)}>
                <option value="">Select your area</option>
                {areas.map((a) => (
                  <option key={a}>{a}</option>
                ))}
                <option>Other area</option>
              </select>
            </label>
          )}

          <div className="wa-preview">
            <span className="wa-preview__label">Your WhatsApp message</span>
            <div className="wa-preview__msg">{message}</div>
            <span className="muted small">You can edit it in WhatsApp before sending.</span>
          </div>

          <div className="next-steps">
            <b>What happens next</b>
            <ol>
              <li>We reply on WhatsApp with final price and time</li>
              <li>Our technician brings and fits the battery</li>
              <li>You pay after fitting: cash or UPI</li>
            </ol>
          </div>
        </div>
      </main>
      <BottomBar whatsappHref={waHref} />
    </>
  );
}
