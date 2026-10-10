import Icon from './Icon.jsx';
import { paths } from '../lib/router.js';
import { phoneLink, whatsappLink } from '../lib/contact.js';
import { useCatalog } from '../data/CatalogContext.jsx';

// Home shows the logo; inner pages show a back button and a title.
export default function Header({ title, backTo }) {
  const { settings } = useCatalog();
  return (
    <header className="topbar">
      <div className="container topbar__row">
        {backTo ? (
          <>
            <a className="icon-btn icon-btn--soft" href={backTo} aria-label="Go back">
              <Icon name="back" />
            </a>
            <span className="topbar__title">{title}</span>
          </>
        ) : (
          <a className="brand" href={paths.home}>
            <span className="brand__mark">
              <Icon name="bolt" />
            </span>
            <span className="brand__name">{settings.shop_name}</span>
          </a>
        )}
        <a className="icon-btn icon-btn--soft" href={phoneLink(settings.phone_number)} aria-label="Call us">
          <Icon name="phone" />
        </a>
        <a
          className="icon-btn icon-btn--green"
          href={whatsappLink(settings.whatsapp_number, `Hi ${settings.shop_name}, I need a battery.`)}
          target="_blank"
          rel="noopener"
          aria-label="Chat on WhatsApp"
        >
          <Icon name="chat" />
        </a>
      </div>
    </header>
  );
}
