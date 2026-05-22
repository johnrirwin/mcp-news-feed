import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthCallback } from './AuthCallback';

const mockClearStoredTokens = vi.fn();
const mockGetCurrentUser = vi.fn();
const mockStoreTokens = vi.fn();

vi.mock('../authApi', () => ({
  clearStoredTokens: () => mockClearStoredTokens(),
  getCurrentUser: () => mockGetCurrentUser(),
  storeTokens: (...args: unknown[]) => mockStoreTokens(...args),
}));

describe('AuthCallback', () => {
  beforeEach(() => {
    mockClearStoredTokens.mockReset();
    mockGetCurrentUser.mockReset();
    mockStoreTokens.mockReset();
    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    window.history.replaceState({}, '', '/');
  });

  it('renders the callback loading state inside the scenic public shell', () => {
    mockGetCurrentUser.mockReturnValue(new Promise(() => {}));
    window.history.replaceState({}, '', '/auth/callback#access_token=test-access&refresh_token=test-refresh');

    render(<AuthCallback />);

    expect(screen.getByTestId('auth-callback-shell')).toHaveClass('ff-public-shell', 'ff-public-app-shell');
    expect(screen.getByTestId('auth-callback-panel')).toHaveClass('ff-public-page-panel');
    expect(screen.getByText('Completing sign in...')).toBeInTheDocument();
    expect(screen.getByText('Bringing your FlyingForge workspace online.')).toBeInTheDocument();
    expect(mockStoreTokens).toHaveBeenCalledWith({
      accessToken: 'test-access',
      refreshToken: 'test-refresh',
      tokenType: 'Bearer',
      expiresIn: 3600,
    });
  });

  it('renders callback errors inside the scenic public shell', async () => {
    window.history.replaceState({}, '', '/auth/callback?error=access_denied&error_description=Sign-in%20failed');

    render(<AuthCallback />);

    await waitFor(() => expect(screen.getByText('Authentication Error')).toBeInTheDocument());
    expect(screen.getByTestId('auth-callback-shell')).toHaveClass('ff-public-shell', 'ff-public-app-shell');
    expect(screen.getByTestId('auth-callback-panel')).toHaveClass('ff-public-page-panel-strong');
    expect(screen.getByText('Sign-in failed')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Return to Sign In' })).toHaveClass('ff-public-cta-primary');
  });
});
