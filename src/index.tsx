import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './app';

import 'react-loading-skeleton/dist/skeleton.css';

import './index.css';
import './index.root.css';
import Providers from './providers/Providers';

const rootElement = document.getElementById('root') as HTMLElement;

if (rootElement && rootElement.hasChildNodes()) {
  console.log('hydrateRoot');
  // Режим гидратации для статических страниц
  ReactDOM.hydrateRoot(
    rootElement,
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  console.log('render');
  // Клиентский рендеринг для новых страниц
  ReactDOM.createRoot(rootElement).render(
    // <React.StrictMode>
    <BrowserRouter>
      <Providers>
        <App />
      </Providers>
    </BrowserRouter>
    // </React.StrictMode>
  );
}
