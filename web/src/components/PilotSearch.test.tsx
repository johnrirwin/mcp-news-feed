import { beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '../test/test-utils';
import { PilotSearch } from './PilotSearch';

vi.mock('../pilotApi', () => ({
  searchPilots: vi.fn(),
}));

vi.mock('../hooks', () => ({
  useDebounce: (value: string) => value,
}));

import { searchPilots } from '../pilotApi';

const mockedSearchPilots = vi.mocked(searchPilots);

describe('PilotSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedSearchPilots.mockResolvedValue({ pilots: [], total: 0 });
  });

  it('renders the glass search shell', () => {
    render(<PilotSearch onSelectPilot={vi.fn()} />);

    expect(screen.getByTestId('pilot-search-shell')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Pilot Directory' })).toHaveClass('ff-auth-page-title');
    expect(screen.getByPlaceholderText('Search by callsign...')).toHaveClass('ff-auth-input');
    expect(screen.getByText('Search for pilots').closest('.ff-auth-card')).toBeInTheDocument();
  });

  it('renders search results with auth glass cards', async () => {
    mockedSearchPilots.mockResolvedValue({
      pilots: [
        {
          id: 'pilot-1',
          callSign: 'MrEyes',
          displayName: 'Mr Eyes',
          effectiveAvatarUrl: '',
        },
      ],
      total: 1,
    });

    const onSelectPilot = vi.fn();
    render(<PilotSearch onSelectPilot={onSelectPilot} />);

    await userEvent.type(screen.getByPlaceholderText('Search by callsign...'), 'mr');

    await waitFor(() => {
      expect(mockedSearchPilots).toHaveBeenCalledWith('mr');
    });

    const resultButton = screen.getByRole('button', { name: /MrEyes/i });
    expect(resultButton).toHaveClass('ff-auth-card');

    await userEvent.click(resultButton);
    expect(onSelectPilot).toHaveBeenCalledWith('pilot-1');
  });
});
