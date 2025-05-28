import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './app';

import Providers from './providers/Providers';

import 'react-loading-skeleton/dist/skeleton.css';

import './index.css';
import './index.root.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <Providers>
      <App />
    </Providers>
  </BrowserRouter>
  // </React.StrictMode>
);
