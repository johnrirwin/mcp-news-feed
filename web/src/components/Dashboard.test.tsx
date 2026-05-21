import type { ComponentProps } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '../test/test-utils';
import { Dashboard } from './Dashboard';
import { getBatteries } from '../batteryApi';
import type { Battery } from '../batteryTypes';

vi.mock('../batteryApi', () => ({
  getBatteries: vi.fn(),
}));

vi.mock('../aircraftApi', () => ({
  getAircraftImageUrl: vi.fn(() => 'https://example.com/aircraft.jpg'),
}));

const mockedGetBatteries = vi.mocked(getBatteries);

const battery: Battery = {
  id: 'battery-1',
  user_id: 'user-1',
  battery_code: 'BAT-A1B2',
  name: 'Race Day Pack',
  chemistry: 'LIPO',
  cells: 6,
  capacity_mah: 1300,
  total_cycles: 42,
  last_logged_date: '2026-05-20T12:00:00Z',
  created_at: '2026-05-01T00:00:00Z',
  updated_at: '2026-05-20T12:00:00Z',
};

function createProps(overrides: Partial<ComponentProps<typeof Dashboard>> = {}): ComponentProps<typeof Dashboard> {
  return {
    recentAircraft: [
      {
        id: 'aircraft-1',
        userId: 'user-1',
        name: 'Apex 5 Freestyle',
        nickname: 'Park ripper',
        type: 'freestyle',
        hasImage: true,
        createdAt: '2026-05-01T00:00:00Z',
        updatedAt: '2026-05-19T00:00:00Z',
      },
    ],
    recentNews: [
      {
        id: 'news-1',
        title: 'New freestyle frame drops this week',
        url: 'https://example.com/news-1',
        source: 'source-1',
        sourceType: 'rss',
        publishedAt: '2026-05-20T12:00:00Z',
        tags: ['fpv'],
      },
    ],
    sources: [
      {
        id: 'source-1',
        name: 'Rotor World',
        url: 'https://example.com/source',
        sourceType: 'rss',
        description: 'FPV news',
        feedType: 'rss',
        enabled: true,
      },
    ],
    isAircraftLoading: false,
    isNewsLoading: false,
    onAddAircraft: vi.fn(),
    onViewAllNews: vi.fn(),
    onViewAllAircraft: vi.fn(),
    onViewAllBatteries: vi.fn(),
    onSelectAircraft: vi.fn(),
    onSelectNewsItem: vi.fn(),
    ...overrides,
  };
}

describe('Dashboard', () => {
  beforeEach(() => {
    mockedGetBatteries.mockResolvedValue({
      batteries: [battery],
      total: 1,
    });
  });

  it('renders the hangar-first dashboard shell with aircraft, battery tracker, and highlights', async () => {
    render(<Dashboard {...createProps()} />);

    expect(screen.getByRole('heading', { name: 'My Hangar' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Aircraft Cards' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Battery Tracker' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Recent Highlights' })).toBeInTheDocument();

    await waitFor(() => {
      expect(mockedGetBatteries).toHaveBeenCalledWith({ limit: 4, sort_by: 'logged', sort_order: 'desc' });
    });

    expect(screen.getByText('Race Day Pack')).toBeInTheDocument();
    expect(screen.getByText(/Rotor World/i)).toBeInTheDocument();
  });

  it('calls onAddAircraft when the primary CTA is clicked', async () => {
    const user = userEvent.setup();
    const onAddAircraft = vi.fn();
    render(<Dashboard {...createProps({ onAddAircraft })} />);

    await user.click(screen.getByRole('button', { name: /Add New Aircraft/i }));

    expect(onAddAircraft).toHaveBeenCalledTimes(1);
  });

  it('opens the selected news item from recent highlights', async () => {
    const user = userEvent.setup();
    const onSelectNewsItem = vi.fn();
    render(<Dashboard {...createProps({ onSelectNewsItem })} />);

    await user.click(screen.getByRole('button', { name: /New freestyle frame drops this week/i }));

    expect(onSelectNewsItem).toHaveBeenCalledWith(expect.objectContaining({ id: 'news-1' }));
  });
});
