import { screen, waitFor, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { Loading } from '../../components/common';
import { store } from '../../store/store';
import { server } from '../../tests/server';

import Home from './index';
import '@testing-library/jest-dom';

describe('Home', () => {
  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  it('should display all categories', async () => {
    render(
      <Provider store={store}>
        <PersistGate loading={<Loading />} persistor={persistStore(store)}>
          <BrowserRouter>
            <Home />
          </BrowserRouter>
        </PersistGate>
      </Provider>
    );

    await waitFor(() => {
      // expect(screen.getByText(/promotions/i)).toBeInTheDocument();
      expect(screen.getByText(/category/i)).toBeInTheDocument();
      expect(screen.getByText(/animal/i)).toBeInTheDocument();
      expect(
        screen.getByText(
          /there are various products with special prices waiting for you/i
        )
      ).toBeInTheDocument();
      expect(screen.getByText(/recommended products/i)).toBeInTheDocument();
      expect(
        screen.getByText(/these are the most seen products/i)
      ).toBeInTheDocument();
    });
  });
});
