import { useState } from 'react';
import Header from '../components/Header.jsx';
import Icon from '../components/Icon.jsx';
import { useCatalog } from '../data/CatalogContext.jsx';
import { areaList, whatsappLink } from '../lib/contact.js';
import { paths } from '../lib/router.js';

const TYPES = ['Garage / mechanic', 'Electrician', 'Car / bike dealer', 'Solar installer', 'Housing society', 'Other'];

export default function Partner() {
  const { settings } = useCatalog();
  const areas = areaList(settings);
  const [business, setBusiness] = useState('');
  const [type, setType] = useState(TYPES[0]);
  const [area, setArea] = useState('');

  const message = [
    `Hi ${settings.shop_name}, I want to become a partner.`,
    business && `• Business: ${business}`,
    `• I am a: ${type}`,
    area && `• Area: ${area}`,
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <>
      <Header title="Partner with us" backTo={paths.home} />
      <main>
        <section className="band">
          <div className="container">
            <span className="pill pill--accent">For garages, electricians &amp; dealers</span>
            <h1>Send us customers. Earn on every battery.</h1>
            <p>Also for solar installers, shops and housing societies.</p>
          </div>
        </section>
        <div className="container page stack">
          <div className="perks">
            <div><b>Commission on every battery</b><span className="muted">Paid every week on UPI</span></div>
            <div><b>Partner price</b><span className="muted">When you fit the battery yourself</span></div>
            <div><b>Your orders go first</b><span className="muted">Fast delivery to you or your customer</span></div>
          </div>
          <div className="form-card stack">
            <h2 className="section-title">Join in 1 minute</h2>
            <label className="field">
              <span className="legend">Shop / business name</span>
              <input type="text" value={business} onChange={(e) => setBusiness(e.target.value)} />
            </label>
            <label className="field">
              <span className="legend">You are a</span>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                {TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            {areas.length > 0 && (
              <label className="field">
                <span className="legend">Area</span>
                <select value={area} onChange={(e) => setArea(e.target.value)}>
                  <option value="">Select your area</option>
                  {areas.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </label>
            )}
            <a className="btn btn--whatsapp btn--lg" href={whatsappLink(settings.whatsapp_number, message)} target="_blank" rel="noopener">
              <Icon name="chat" size={20} />
              Send on WhatsApp
            </a>
            <span className="muted small center">We'll call you back and share the rate list.</span>
          </div>
        </div>
      </main>
    </>
  );
}
