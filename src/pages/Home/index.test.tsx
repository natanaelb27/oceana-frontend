import { screen, waitFor } from '@testing-library/react';
import { server } from '../../tests/server';

import '@testing-library/jest-dom';
import { renderWithProviders } from '../../tests/test';
import Home from './index';
import { categoriesMock } from '../../mocks/categories';

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

  it('should render all data', async () => {
    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/promotions/i)).toBeInTheDocument();
      expect(screen.getByText(/category/i)).toBeInTheDocument();
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

    await waitFor(() => {
      categoriesMock.data?.forEach(({ name }) => {
        expect(screen.getByText(new RegExp(name, 'i'))).toBeInTheDocument();
      });
    });
  });
});
