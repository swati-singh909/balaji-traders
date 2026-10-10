import Icon from './Icon.jsx';
import { paths } from '../lib/router.js';
import { formatPrice, whatsappLink } from '../lib/contact.js';
import { CATEGORIES } from '../config.js';

export function specLine(product) {
  const parts = [];
  if (product.ahs.length === 1) parts.push(`${product.ahs[0]} Ah`);
  if (product.ahs.length > 1) parts.push(`${product.ahs[0]}–${product.ahs[product.ahs.length - 1]} Ah`);
  if (product.warranty) parts.push(`${product.warranty} months warranty`);
  return parts.join(' · ');
}

export function categoryName(id) {
  const cat = CATEGORIES.find((c) => c.id === id);
  return cat ? cat.short || cat.label : id;
}

export function ProductImage({ product, className = '' }) {
  return product.image ? (
    <img className={className} src={product.image} alt={product.name} loading="lazy" decoding="async" />
  ) : (
    <span className={`img-missing ${className}`}>
      <Icon name="battery" size={40} strokeWidth={1.6} />
    </span>
  );
}

export default function ProductCard({ product, settings }) {
  const message = `Hi ${settings.shop_name}, I want to buy:\n• ${product.name}\nPlease share price and fitting time.`;
  return (
    <article className="pcard">
      <a className="pcard__main" href={paths.product(product.slug)}>
        <span className="pcard__img">
          <ProductImage product={product} />
          {product.highlight && <span className="pcard__badge">Top pick</span>}
        </span>
        <span className="pcard__info">
          <span className="eyebrow">{categoryName(product.category)}</span>
          <span className="pcard__name">{product.name}</span>
          {specLine(product) && <span className="muted">{specLine(product)}</span>}
          <span className="pcard__price">
            {product.minPrice !== null ? (
              <>
                {product.ahs.length > 1 && <small>from </small>}
                {formatPrice(product.minPrice)}
              </>
            ) : (
              <small className="ask">Price on WhatsApp</small>
            )}
          </span>
        </span>
      </a>
      <div className="pcard__actions">
        <a className="btn btn--whatsapp" href={whatsappLink(settings.whatsapp_number, message)} target="_blank" rel="noopener">
          <Icon name="chat" size={18} />
          Order on WhatsApp
        </a>
        <a className="btn btn--outline" href={paths.product(product.slug)}>
          Details
        </a>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="pcard pcard--skeleton" aria-hidden="true">
      <div className="pcard__main">
        <span className="pcard__img shimmer" />
        <span className="pcard__info">
          <span className="shimmer line line--short" />
          <span className="shimmer line" />
          <span className="shimmer line line--mid" />
        </span>
      </div>
      <span className="shimmer line line--btn" />
    </div>
  );
}
