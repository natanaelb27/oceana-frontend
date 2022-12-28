import React from 'react';
import ReactDOM from 'react-dom/client';

import 'react-toastify/dist/ReactToastify.css';
import 'react-medium-image-zoom/dist/styles.css';
import 'react-datepicker/dist/react-datepicker.css';

import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store/store';

import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { Loading } from './components/common';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistStore(store)}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
