import { lazy, Suspense } from 'react';
import { useRoute } from './lib/router.js';
import Home from './pages/Home.jsx';

// Home loads first; other pages are fetched only when opened.
const Product = lazy(() => import('./pages/Product.jsx'));
const Service = lazy(() => import('./pages/Service.jsx'));
const Partner = lazy(() => import('./pages/Partner.jsx'));

export default function App() {
  const route = useRoute();
  return (
    <Suspense fallback={<div className="page-loading" />}>
      {route.page === 'product' && <Product slug={route.slug} />}
      {route.page === 'service' && <Service />}
      {route.page === 'partner' && <Partner />}
      {route.page === 'home' && <Home />}
    </Suspense>
  );
}
