import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '../test/test-utils';
import { useAuth } from '../hooks/useAuth';
import { BuildBuilder } from './BuildBuilder';

vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('./CatalogSearchModal', () => ({
  CatalogSearchModal: () => null,
}));

const mockedUseAuth = vi.mocked(useAuth);

describe('BuildBuilder', () => {
  beforeEach(() => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: null,
      tokens: null,
      error: null,
      loginWithGoogle: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      clearError: vi.fn(),
    });
  });

  it('renders the build image panel with shared glass styling', () => {
    render(
      <BuildBuilder
        title="Kayou Build"
        description=""
        youtubeUrl=""
        flightYoutubeUrl=""
        parts={[]}
        onTitleChange={vi.fn()}
        onDescriptionChange={vi.fn()}
        onYouTubeUrlChange={vi.fn()}
        onFlightYouTubeUrlChange={vi.fn()}
        onPartsChange={vi.fn()}
        imagePreviewUrl="https://example.com/build.png"
        onImageAction={vi.fn()}
        imageHelperText="JPEG or PNG. Max 2MB."
      />,
    );

    expect(screen.getByTestId('build-builder-editor')).toHaveClass('ff-auth-card');
    expect(screen.getByTestId('build-image-panel')).toHaveClass('ff-modal-surface');
    expect(screen.getByTestId('build-image-preview')).toHaveClass('ff-modal-surface-soft');
    expect(screen.getByRole('button', { name: 'Change Image' })).toHaveClass('ff-auth-cta-secondary');
    expect(screen.getByText('JPEG or PNG. Max 2MB.')).toHaveClass('text-xs', 'text-slate-300/72');
    expect(screen.getByLabelText('Build title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Build video (optional)')).toBeInTheDocument();
    expect(screen.getByLabelText('Flight video (optional)')).toBeInTheDocument();
  });
});
