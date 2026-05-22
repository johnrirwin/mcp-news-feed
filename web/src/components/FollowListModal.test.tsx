import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '../test/test-utils';
import { FollowListModal } from './FollowListModal';

vi.mock('../socialApi', () => ({
  getFollowers: vi.fn(),
  getFollowing: vi.fn(),
}));

import { getFollowers, getFollowing } from '../socialApi';

const mockedGetFollowers = vi.mocked(getFollowers);
const mockedGetFollowing = vi.mocked(getFollowing);

describe('FollowListModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetFollowers.mockResolvedValue({ pilots: [], totalCount: 0 });
    mockedGetFollowing.mockResolvedValue({ pilots: [], totalCount: 0 });
  });

  it('closes when clicking the backdrop', async () => {
    const onClose = vi.fn();
    const { container } = render(
      <FollowListModal
        userId="pilot-1"
        userName="UmbraVenti"
        type="followers"
        onClose={onClose}
        onSelectPilot={vi.fn()}
      />,
    );

    await waitFor(() => {
      expect(mockedGetFollowers).toHaveBeenCalledWith('pilot-1', 50, 0);
    });

    const backdrop = container.querySelector('.ff-modal-backdrop');
    if (!(backdrop instanceof HTMLElement)) {
      throw new Error('Backdrop not found');
    }

    fireEvent.click(backdrop);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('loads following lists from the correct API', async () => {
    render(
      <FollowListModal
        userId="pilot-1"
        userName="UmbraVenti"
        type="following"
        onClose={vi.fn()}
        onSelectPilot={vi.fn()}
      />,
    );

    await waitFor(() => {
      expect(mockedGetFollowing).toHaveBeenCalledWith('pilot-1', 50, 0);
    });

    expect(screen.getByRole('heading', { name: 'Following' })).toBeInTheDocument();
  });
});
