import { useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import BottomBar from '../components/BottomBar.jsx';
import Icon from '../components/Icon.jsx';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard.jsx';
import { useCatalog } from '../data/CatalogContext.jsx';
import { CATEGORIES } from '../config.js';
import { areaList, phoneLink, whatsappLink } from '../lib/contact.js';
import { paths } from '../lib/router.js';

const TAB_KEY = 'bt_tab';

function initialTab() {
  try {
    return sessionStorage.getItem(TAB_KEY) || 'all';
  } catch {
    return 'all';
  }
}

export default function Home() {
  const { products, settings, status, loadedAt } = useCatalog();
  const [tab, setTab] = useState(initialTab);

  const pickTab = (id) => {
    setTab(id);
    try {
      sessionStorage.setItem(TAB_KEY, id);
    } catch {
      /* ignore */
    }
  };

  const visible = useMemo(
    () => (tab === 'all' ? products : products.filter((p) => p.category === tab)),
    [products, tab],
  );
  const tabLabel = CATEGORIES.find((c) => c.id === tab)?.label || '';
  const waGeneral = whatsappLink(settings.whatsapp_number, `Hi ${settings.shop_name}, I need a battery.`);
  const badge = settings.fitting_time ? `Fitted at your door in ${settings.fitting_time}` : 'Free fitting at your door';
  const areas = areaList(settings);

  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="hero__blob hero__blob--a" />
          <div className="hero__blob hero__blob--b" />
          <div className="container hero__row">
            <div className="hero__text">
              <span className="pill pill--accent">
                <Icon name="clock" size={16} strokeWidth={2.4} />
                {badge}
              </span>
              <h1>
                Battery dead? <span className="accent">We'll fit a new one</span> at your door.
              </h1>
              <p>Inverter, solar, car, bike, truck and tractor batteries. Free fitting. Give your old battery and pay less.</p>
            </div>
            <div className="hero__media">
              <img
                src="/images/hero-batteries.webp"
                width="1400"
                height="582"
                alt="Enerziq, Epic Power and Energyhouse tall tubular batteries"
                fetchpriority="high"
              />
              <div className="brand-chips">
                <span className="chip">Enerziq</span>
                <span className="chip chip--star">Epic Power</span>
                <span className="chip">Energyhouse</span>
              </div>
              <div className="hero__ctas">
                <a className="btn btn--whatsapp btn--xl" href={waGeneral} target="_blank" rel="noopener">
                  <Icon name="chat" />
                  WhatsApp
                </a>
                <a className="btn btn--accent btn--xl" href={phoneLink(settings.phone_number)}>
                  <Icon name="phone" size={20} />
                  Call now
                </a>
              </div>
              <ul className="ticks">
                <li><Icon name="check" size={16} strokeWidth={3} />Free fitting</li>
                <li><Icon name="check" size={16} strokeWidth={3} />Pay after fitting</li>
                <li><Icon name="check" size={16} strokeWidth={3} />Company warranty</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="catalog container" aria-labelledby="all-batteries">
          <h2 id="all-batteries" className="section-title">All batteries</h2>
          <div className="tabs" role="tablist" aria-label="Battery type">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={tab === c.id}
                className={`tab ${tab === c.id ? 'tab--on' : ''}`}
                onClick={() => pickTab(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>

          {status === 'loading' ? (
            <div className="grid">
              {[0, 1, 2].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              <p className="muted count">
                {visible.length} {visible.length === 1 ? 'battery' : 'batteries'}
              </p>
              <div className="grid">
                {visible.map((p) => (
                  <ProductCard key={p.slug} product={p} settings={settings} />
                ))}
                {visible.length === 0 && (
                  <div className="empty">
                    <b>{tabLabel} batteries: ask us</b>
                    <span className="muted">Tell us your vehicle or need on WhatsApp and we'll send options and prices.</span>
                    <a
                      className="btn btn--whatsapp"
                      href={whatsappLink(settings.whatsapp_number, `Hi ${settings.shop_name}, I need a ${tabLabel.toLowerCase()} battery.`)}
                      target="_blank"
                      rel="noopener"
                    >
                      <Icon name="chat" size={18} />
                      Ask on WhatsApp
                    </a>
                  </div>
                )}
              </div>
            </>
          )}
          {status === 'error' && (
            <p className="notice">Couldn't load prices right now. Please call or WhatsApp us.</p>
          )}

          <a className="service-link" href={paths.service}>
            <span className="service-link__icon">
              <Icon name="wrench" size={26} strokeWidth={1.8} />
            </span>
            <span>
              <b>Need doorstep service?</b>
              <span className="muted">Battery replacement, jump-start, check-up, inverter fitting</span>
            </span>
          </a>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__col">
          <span className="footer__name">{settings.shop_name}</span>
          {settings.address && <span>{settings.address}</span>}
          {settings.hours && <span>Open: {settings.hours}</span>}
          {areas.length > 0 && <span>We deliver in: {areas.join(', ')}</span>}
          {settings.maps_url && (
            <a href={settings.maps_url} target="_blank" rel="noopener">
              <Icon name="pin" size={16} /> Get directions
            </a>
          )}
          <a href={paths.partner}>For garages, electricians &amp; dealers</a>
          {loadedAt && (
            <span className="footer__small">
              Prices updated {new Date(loadedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </span>
          )}
        </div>
      </footer>

      <BottomBar whatsappHref={waGeneral} />
    </>
  );
}
