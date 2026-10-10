import { createContext, useContext, useEffect, useState } from 'react';
import { loadCatalog, readCache } from './catalog.js';
import { DEFAULT_SETTINGS } from '../config.js';

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  // Show the last saved prices instantly, then refresh from the sheet.
  const [state, setState] = useState(() => {
    const cached = readCache();
    return cached
      ? { ...cached, status: 'refreshing' }
      : { products: [], settings: DEFAULT_SETTINGS, loadedAt: null, status: 'loading' };
  });

  useEffect(() => {
    let cancelled = false;
    loadCatalog()
      .then((data) => {
        if (!cancelled) setState({ ...data, status: 'ready' });
      })
      .catch(() => {
        if (!cancelled) {
          setState((prev) => ({ ...prev, status: prev.loadedAt ? 'offline' : 'error' }));
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return <CatalogContext.Provider value={state}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext);
}
