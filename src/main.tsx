import {StrictMode, Suspense, lazy} from 'react';
import {createRoot} from 'react-dom/client';
import LoadingSpinner from './components/LoadingSpinner.tsx';
import './index.css';

const App = lazy(() => import('./App.tsx'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<LoadingSpinner />}>
      <App />
    </Suspense>
  </StrictMode>,
);
