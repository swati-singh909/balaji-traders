import Icon from './Icon.jsx';
import { phoneLink } from '../lib/contact.js';
import { useCatalog } from '../data/CatalogContext.jsx';

// Fixed bar at the bottom of the screen, within thumb reach.
export default function BottomBar({ whatsappHref, whatsappLabel = 'Order on WhatsApp' }) {
  const { settings } = useCatalog();
  return (
    <div className="bottombar">
      <div className="bottombar__row">
        <a className="btn btn--whatsapp btn--lg" href={whatsappHref} target="_blank" rel="noopener">
          <Icon name="chat" size={20} />
          {whatsappLabel}
        </a>
        <a className="btn btn--accent btn--lg" href={phoneLink(settings.phone_number)}>
          <Icon name="phone" size={20} />
          Call
        </a>
      </div>
    </div>
  );
}
