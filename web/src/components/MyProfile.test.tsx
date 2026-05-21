import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MyProfile } from './MyProfile';

const mockUseAuth = vi.fn();
const mockGetProfile = vi.fn();
const mockUpdateProfile = vi.fn();
const mockUploadAvatar = vi.fn();
const mockValidateCallSign = vi.fn();
const mockDeleteAccount = vi.fn();
const mockModerateImageUpload = vi.fn();

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('../profileApi', () => ({
  getProfile: () => mockGetProfile(),
  updateProfile: (...args: unknown[]) => mockUpdateProfile(...args),
  uploadAvatar: (...args: unknown[]) => mockUploadAvatar(...args),
  validateCallSign: (...args: unknown[]) => mockValidateCallSign(...args),
  deleteAccount: (...args: unknown[]) => mockDeleteAccount(...args),
  moderateImageUpload: (...args: unknown[]) => mockModerateImageUpload(...args),
}));

describe('MyProfile', () => {
  beforeEach(() => {
    mockUseAuth.mockReset();
    mockGetProfile.mockReset();
    mockUpdateProfile.mockReset();
    mockUploadAvatar.mockReset();
    mockValidateCallSign.mockReset();
    mockDeleteAccount.mockReset();
    mockModerateImageUpload.mockReset();

    mockUseAuth.mockReturnValue({
      updateUser: vi.fn(),
      logout: vi.fn(),
    });

    mockValidateCallSign.mockReturnValue(null);
    mockGetProfile.mockResolvedValue({
      email: 'pilot@example.com',
      callSign: 'FPVPilot',
      displayName: 'Pilot Name',
      avatarUrl: null,
      createdAt: '2026-05-01T00:00:00.000Z',
    });
  });

  it('renders the read-only email field with the glass auth shell styling', async () => {
    render(<MyProfile />);

    const emailValue = await screen.findByText('pilot@example.com');
    await waitFor(() => expect(mockGetProfile).toHaveBeenCalled());

    expect(emailValue).toHaveClass('ff-auth-readonly', 'ff-auth-on-shell');
    expect(screen.getByLabelText('Callsign')).toHaveClass('bg-slate-700');
  });
});
