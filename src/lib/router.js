import { useEffect, useState } from 'react';

// Tiny hash router: #/  #/battery/<slug>  #/service  #/partner
// Hash links work on any static host without server rewrites.
function parse(hash) {
  const path = hash.replace(/^#/, '') || '/';
  const parts = path.split('/').filter(Boolean);
  if (parts[0] === 'battery' && parts[1]) return { page: 'product', slug: decodeURIComponent(parts[1]) };
  if (parts[0] === 'service') return { page: 'service' };
  if (parts[0] === 'partner') return { page: 'partner' };
  return { page: 'home' };
}

const scrollKey = (hash) => `bt_scroll_${hash || '#/'}`;

export function useRoute() {
  const [route, setRoute] = useState(() => parse(window.location.hash));

  useEffect(() => {
    const onChange = (event) => {
      // Remember where the visitor was on the page they left.
      try {
        const oldHash = new URL(event.oldURL).hash;
        sessionStorage.setItem(scrollKey(oldHash), String(window.scrollY));
      } catch {
        /* ignore */
      }
      const next = parse(window.location.hash);
      setRoute(next);
      // Home goes back to where they were in the list; other pages start at top.
      const saved = next.page === 'home' ? Number(sessionStorage.getItem(scrollKey(window.location.hash)) || 0) : 0;
      requestAnimationFrame(() => window.scrollTo(0, saved));
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}

export const paths = {
  home: '#/',
  product: (slug) => `#/battery/${encodeURIComponent(slug)}`,
  service: '#/service',
  partner: '#/partner',
};
