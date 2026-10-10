import { useState } from 'react';
import Header from '../components/Header.jsx';
import Icon from '../components/Icon.jsx';
import { useCatalog } from '../data/CatalogContext.jsx';
import { areaList, whatsappLink } from '../lib/contact.js';
import { paths } from '../lib/router.js';

const SERVICES = [
  { name: 'Battery replacement', desc: 'New battery fitted, old one taken', tag: 'Free fitting' },
  { name: 'Jump-start', desc: "Vehicle won't start" },
  { name: 'Battery check-up', desc: 'Is my battery weak?', tag: 'Free' },
  { name: 'Inverter fitting', desc: 'New inverter or battery set up' },
  { name: 'Solar fitting / survey', desc: 'Roof check and plan' },
];
const FOR = ['Inverter', 'Car', 'Bike', 'Truck', 'Tractor', 'Solar'];
const WHEN = ['Now', 'Today evening', 'Tomorrow'];
const TITLES = ['What do you need?', 'Tell us about it', 'Area and time'];

export default function Service() {
  const { settings } = useCatalog();
  const areas = areaList(settings);
  const [step, setStep] = useState(0);
  const [service, setService] = useState(0);
  const [forWhat, setForWhat] = useState(0);
  const [vehicle, setVehicle] = useState('');
  const [exchange, setExchange] = useState(true);
  const [area, setArea] = useState('');
  const [when, setWhen] = useState(0);

  const lines = [
    `Hi ${settings.shop_name}, I need a doorstep service:`,
    `• ${SERVICES[service].name}`,
    `• For: ${FOR[forWhat]}${vehicle ? ` (${vehicle})` : ''}`,
    `• Old battery exchange: ${exchange ? 'Yes' : 'No'}`,
  ];
  if (area) lines.push(`• Area: ${area}`);
  lines.push(`• When: ${WHEN[when]}`);
  const message = lines.join('\n');

  const go = (n) => {
    setStep(n);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Header title="Doorstep service" backTo={paths.home} />
      <main className="container page wizard">
        <div className="wizard__head">
          <span className="eyebrow">Step {step + 1} of 3</span>
          <h1 className="section-title">{TITLES[step]}</h1>
          <div className="progress" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span key={i} className={i <= step ? 'on' : ''} />
            ))}
          </div>
        </div>

        {step === 0 && (
          <div className="stack">
            {SERVICES.map((s, i) => (
              <button
                key={s.name}
                type="button"
                className={`option ${i === service ? 'option--on' : ''}`}
                aria-pressed={i === service}
                onClick={() => setService(i)}
              >
                <span>
                  <b>{s.name}</b>
                  <span className="muted">{s.desc}</span>
                </span>
                {s.tag && <span className="option__tag">{s.tag}</span>}
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="stack">
            <fieldset className="field">
              <legend>For</legend>
              <div className="sizes">
                {FOR.map((f, i) => (
                  <button
                    key={f}
                    type="button"
                    className={`size ${i === forWhat ? 'size--on' : ''}`}
                    aria-pressed={i === forWhat}
                    onClick={() => setForWhat(i)}
                  >
                    <span className="size__ah">{f}</span>
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="field">
              <span className="legend">Vehicle or inverter (optional)</span>
              <input
                type="text"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                placeholder="e.g. Swift petrol, or 1100 VA inverter"
              />
            </label>
            <fieldset className="field">
              <legend>Old battery to exchange?</legend>
              <div className="choices">
                <button type="button" className={`choice ${exchange ? 'choice--on' : ''}`} aria-pressed={exchange} onClick={() => setExchange(true)}>
                  <span className="choice__title">Yes</span>
                </button>
                <button type="button" className={`choice ${!exchange ? 'choice--on' : ''}`} aria-pressed={!exchange} onClick={() => setExchange(false)}>
                  <span className="choice__title">No</span>
                </button>
              </div>
            </fieldset>
          </div>
        )}

        {step === 2 && (
          <div className="stack">
            {areas.length > 0 && (
              <label className="field">
                <span className="legend">Your area</span>
                <select value={area} onChange={(e) => setArea(e.target.value)}>
                  <option value="">Select your area</option>
                  {areas.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                  <option>Other area</option>
                </select>
              </label>
            )}
            <fieldset className="field">
              <legend>When?</legend>
              <div className="sizes">
                {WHEN.map((w, i) => (
                  <button
                    key={w}
                    type="button"
                    className={`size ${i === when ? 'size--on' : ''}`}
                    aria-pressed={i === when}
                    onClick={() => setWhen(i)}
                  >
                    <span className="size__ah">{w}</span>
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="wa-preview">
              <span className="wa-preview__label">Your WhatsApp message</span>
              <div className="wa-preview__msg">{message}</div>
            </div>
            <p className="muted small">Send your exact address in the WhatsApp chat. Pay only after the work is done.</p>
          </div>
        )}
      </main>

      <div className="bottombar">
        <div className="bottombar__row bottombar__row--wizard">
          {step > 0 && (
            <button type="button" className="btn btn--outline btn--lg" onClick={() => go(step - 1)}>
              Back
            </button>
          )}
          {step < 2 ? (
            <button type="button" className="btn btn--primary btn--lg" onClick={() => go(step + 1)}>
              Next
            </button>
          ) : (
            <a className="btn btn--whatsapp btn--lg" href={whatsappLink(settings.whatsapp_number, message)} target="_blank" rel="noopener">
              <Icon name="chat" size={20} />
              Send on WhatsApp
            </a>
          )}
        </div>
      </div>
    </>
  );
}
