import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

const mockUseAuth = vi.fn();
const mockUseFilters = vi.fn();
const mockedGetItems = vi.fn();
const mockedGetSources = vi.fn();

vi.mock('./components', () => ({
  Sidebar: () => <div data-testid="sidebar" />,
  Dashboard: () => <div data-testid="dashboard" />,
  ItemDetail: () => null,
  AddGearModal: () => null,
  AircraftForm: () => null,
  AircraftDetail: () => null,
  PilotProfile: ({ pilotId }: { pilotId: string }) => <div data-testid="pilot-profile-stub">{pilotId}</div>,
}));

vi.mock('./AppRoutes', () => ({
  AppRoutes: ({ onSelectPilot }: { onSelectPilot?: (pilotId: string) => void }) => (
    <div data-testid="app-routes">
      <button type="button" onClick={() => onSelectPilot?.('pilot-1')}>
        open-pilot-profile
      </button>
    </div>
  ),
}));

vi.mock('./hooks', () => ({
  useFilters: () => mockUseFilters(),
}));

vi.mock('./hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('./hooks/useGoogleAnalytics', () => ({
  useGoogleAnalytics: vi.fn(),
  trackEvent: vi.fn(),
}));

vi.mock('./api', () => ({
  getItems: (...args: unknown[]) => mockedGetItems(...args),
  getSources: (...args: unknown[]) => mockedGetSources(...args),
}));

describe('App shell styling', () => {
  beforeEach(() => {
    mockUseFilters.mockReturnValue({
      filters: {
        query: '',
        sources: [],
        sourceType: 'all',
        sort: 'newest',
        fromDate: '',
        toDate: '',
      },
      updateFilter: vi.fn(),
    });

    mockedGetItems.mockResolvedValue({ items: [], totalCount: 0 });
    mockedGetSources.mockResolvedValue({ sources: [] });
  });

  it('uses the scenic public shell for logged-out non-home routes', async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: vi.fn(),
      isLoading: false,
    });

    render(
      <MemoryRouter initialEntries={['/news']}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockedGetSources).toHaveBeenCalled();
      expect(mockedGetItems).toHaveBeenCalled();
    });

    expect(screen.getByTestId('app-shell')).toHaveClass('ff-public-shell');
    expect(screen.getByTestId('app-shell')).toHaveClass('ff-public-app-shell');
    expect(screen.getByTestId('app-shell')).not.toHaveClass('ff-public-home-shell');
    expect(screen.getByTestId('mobile-shell-header')).toHaveClass('ff-public-mobile-header');
  });

  it('keeps the homepage-specific hero shell on the logged-out home route', async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: vi.fn(),
      isLoading: false,
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockedGetSources).toHaveBeenCalled();
      expect(mockedGetItems).toHaveBeenCalled();
    });

    expect(screen.getByTestId('app-shell')).toHaveClass('ff-public-home-shell');
    expect(screen.getByTestId('mobile-shell-header')).toHaveClass('ff-public-mobile-header');
  });

  it('uses the authenticated shell for signed-in routes', async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: {
        id: 'user-1',
        email: 'pilot@example.com',
        displayName: 'Pilot',
      },
      logout: vi.fn(),
      isLoading: false,
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockedGetSources).toHaveBeenCalled();
      expect(mockedGetItems).toHaveBeenCalled();
    });

    expect(screen.getByTestId('app-shell')).toHaveClass('ff-auth-shell');
    expect(screen.getByTestId('app-shell')).toHaveClass('ff-auth-app-shell');
    expect(screen.getByTestId('mobile-shell-header')).toHaveClass('ff-auth-mobile-header');
  });

  it('uses the shared glass modal shell for social pilot profiles', async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: {
        id: 'user-1',
        email: 'pilot@example.com',
        displayName: 'Pilot',
      },
      logout: vi.fn(),
      isLoading: false,
    });

    render(
      <MemoryRouter initialEntries={['/social']}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockedGetSources).toHaveBeenCalled();
      expect(mockedGetItems).toHaveBeenCalled();
    });

    await userEvent.click(screen.getByRole('button', { name: 'open-pilot-profile' }));

    const dialog = await screen.findByRole('dialog', { name: 'Pilot Profile' });
    expect(dialog.querySelector('.ff-modal-backdrop')).toBeInTheDocument();
    expect(dialog.querySelector('.ff-auth-modal-panel')).toBeInTheDocument();
    expect(screen.getByTestId('pilot-profile-stub')).toHaveTextContent('pilot-1');
  });
});
