// WhatsApp click-to-chat: https://wa.me/<digits>?text=<url-encoded message>
export function whatsappLink(number, message) {
  const digits = String(number || '').replace(/\D/g, '');
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${digits}${text}`;
}

export function phoneLink(number) {
  const cleaned = String(number || '').replace(/[^\d+]/g, '');
  return `tel:${cleaned}`;
}

const rupee = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatPrice(value) {
  return value === null || value === undefined ? '' : rupee.format(value);
}

export function areaList(settings) {
  return String(settings.areas || '')
    .split(',')
    .map((a) => a.trim())
    .filter(Boolean);
}
