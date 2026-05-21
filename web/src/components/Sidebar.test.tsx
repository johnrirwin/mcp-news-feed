import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '../test/test-utils'
import { Sidebar } from './Sidebar'
import type { User } from '../authTypes'

const mockUser: User = {
  id: 'user-1',
  email: 'test@example.com',
  displayName: 'Test User',
  avatarUrl: 'https://example.com/avatar.jpg',
  status: 'active',
  emailVerified: true,
  isAdmin: false,
  isContentAdmin: false,
  isGearAdmin: false,
  createdAt: '2025-01-01T00:00:00Z',
}

function createDefaultProps(overrides = {}) {
  return {
    activeSection: 'news' as const,
    onSectionChange: vi.fn(),
    isAuthenticated: false,
    user: null,
    authLoading: false,
    onSignIn: vi.fn(),
    onSignOut: vi.fn(),
    isMobileMenuOpen: false,
    onMobileMenuClose: vi.fn(),
    ...overrides,
  }
}

describe('Sidebar', () => {
  describe('Layout', () => {
    it("keeps sidebar vertically scrollable and doesn't include md:overflow-hidden class", () => {
      render(<Sidebar {...createDefaultProps()} />)

      const sidebar = screen.getByRole('complementary')
      expect(sidebar).toBeInTheDocument()
      expect(sidebar).toHaveClass('overflow-y-auto')
      expect(sidebar.className).not.toContain('md:overflow-hidden')
    })
  })

  describe('Navigation', () => {
    it('renders the public landing-page navigation for unauthenticated users', () => {
      render(<Sidebar {...createDefaultProps()} />)

      expect(screen.getByText('FlyingForge')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Home/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /News/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Shop/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Gear/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Builds/i })).toBeInTheDocument()
      expect(screen.queryByText('Taking Off')).not.toBeInTheDocument()
      expect(screen.queryByText('My Inventory')).not.toBeInTheDocument()
      expect(screen.queryByText('My Aircraft')).not.toBeInTheDocument()
    })

    it('renders Dashboard and authenticated sections for signed-in users', () => {
      render(<Sidebar {...createDefaultProps({ isAuthenticated: true, user: mockUser })} />)

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.queryByText('Home')).not.toBeInTheDocument()
      expect(screen.getByText('My Inventory')).toBeInTheDocument()
      expect(screen.getByText('My Aircraft')).toBeInTheDocument()
      expect(screen.getByText('My Radio')).toBeInTheDocument()
      expect(screen.getByText('My Batteries')).toBeInTheDocument()
      expect(screen.getByRole('complementary')).toHaveClass('ff-auth-rail')
    })

    it('calls onSectionChange when navigation items are clicked', () => {
      const onSectionChange = vi.fn()
      render(<Sidebar {...createDefaultProps({ onSectionChange })} />)

      fireEvent.click(screen.getByRole('button', { name: /News/i }))
      expect(onSectionChange).toHaveBeenCalledWith('news')

      fireEvent.click(screen.getByRole('button', { name: /Shop/i }))
      expect(onSectionChange).toHaveBeenCalledWith('equipment')
    })

    it('marks the active item with aria-current', () => {
      render(<Sidebar {...createDefaultProps({ activeSection: 'equipment' })} />)

      expect(screen.getByRole('button', { name: /Shop/i })).toHaveAttribute('aria-current', 'page')
      expect(screen.getByRole('button', { name: /News/i })).not.toHaveAttribute('aria-current')
    })

    it('shows My Builds directly under My Aircraft for authenticated users', () => {
      render(<Sidebar {...createDefaultProps({ isAuthenticated: true, user: mockUser })} />)

      const aircraftButton = screen.getByRole('button', { name: /My Aircraft/i })
      const myBuildsButton = screen.getByRole('button', { name: /My Builds/i })
      const myRadioButton = screen.getByRole('button', { name: /My Radio/i })
      const myBatteriesButton = screen.getByRole('button', { name: /My Batteries/i })

      expect(aircraftButton.compareDocumentPosition(myBuildsButton) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
      expect(myBuildsButton.compareDocumentPosition(myRadioButton) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
      expect(myRadioButton.compareDocumentPosition(myBatteriesButton) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    })
  })

  describe('Inventory navigation', () => {
    it('does not render inventory filter controls inside the sidebar', () => {
      render(<Sidebar {...createDefaultProps({
        activeSection: 'inventory',
        isAuthenticated: true,
        user: mockUser,
      })} />)

      expect(screen.queryByText('Condition')).not.toBeInTheDocument()
      expect(screen.queryByText('Categories')).not.toBeInTheDocument()
      expect(screen.queryByText('All Categories')).not.toBeInTheDocument()
      expect(screen.queryByText('Total Items')).not.toBeInTheDocument()
      expect(screen.queryByText('Total Value')).not.toBeInTheDocument()
    })
  })

  describe('Authentication', () => {
    it('shows Sign In button when not authenticated', () => {
      render(<Sidebar {...createDefaultProps()} />)

      expect(screen.getByText('Sign In')).toBeInTheDocument()
    })

    it('calls onSignIn when Sign In button is clicked', () => {
      const onSignIn = vi.fn()
      render(<Sidebar {...createDefaultProps({ onSignIn })} />)

      fireEvent.click(screen.getByText('Sign In'))
      expect(onSignIn).toHaveBeenCalled()
    })

    it('shows user info when authenticated', () => {
      render(<Sidebar {...createDefaultProps({
        isAuthenticated: true,
        user: mockUser,
      })} />)

      expect(screen.getByText('Test User')).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })

    it('shows user avatar when available', () => {
      render(<Sidebar {...createDefaultProps({
        isAuthenticated: true,
        user: mockUser,
      })} />)

      const avatar = screen.getByAltText('Test User')
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg')
    })

    it('shows initial letter when no avatar', () => {
      const userWithoutAvatar = { ...mockUser, avatarUrl: undefined }
      render(<Sidebar {...createDefaultProps({
        isAuthenticated: true,
        user: userWithoutAvatar,
      })} />)

      expect(screen.getByText('T')).toBeInTheDocument()
    })

    it('shows Sign Out button when authenticated', () => {
      render(<Sidebar {...createDefaultProps({
        isAuthenticated: true,
        user: mockUser,
      })} />)

      expect(screen.getByText('Sign Out')).toBeInTheDocument()
    })

    it('calls onSignOut when Sign Out button is clicked', () => {
      const onSignOut = vi.fn()
      render(<Sidebar {...createDefaultProps({
        isAuthenticated: true,
        user: mockUser,
        onSignOut,
      })} />)

      fireEvent.click(screen.getByText('Sign Out'))
      expect(onSignOut).toHaveBeenCalled()
    })

    it('shows loading spinner when auth is loading', () => {
      const { container } = render(<Sidebar {...createDefaultProps({ authLoading: true })} />)

      const spinner = container.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    })
  })

  describe('Admin Navigation', () => {
    it('hides admin sections for regular users', () => {
      render(<Sidebar {...createDefaultProps({
        isAuthenticated: true,
        user: mockUser,
      })} />)

      expect(screen.queryByText('Content Moderation')).not.toBeInTheDocument()
      expect(screen.queryByText('Announcements')).not.toBeInTheDocument()
      expect(screen.queryByText('User Admin')).not.toBeInTheDocument()
    })

    it('hides admin sections when unauthenticated', () => {
      render(<Sidebar {...createDefaultProps({
        isAuthenticated: false,
        user: null,
      })} />)

      expect(screen.queryByText('Content Moderation')).not.toBeInTheDocument()
      expect(screen.queryByText('Announcements')).not.toBeInTheDocument()
      expect(screen.queryByText('User Admin')).not.toBeInTheDocument()
    })

    it('shows both admin sections for admin users', () => {
      const adminUser: User = { ...mockUser, isAdmin: true }
      render(<Sidebar {...createDefaultProps({
        isAuthenticated: true,
        user: adminUser,
      })} />)

      expect(screen.getByText('Content Moderation')).toBeInTheDocument()
      expect(screen.getByText('Announcements')).toBeInTheDocument()
      expect(screen.getByText('User Admin')).toBeInTheDocument()
    })

    it('shows content moderation and announcements for content-admin users', () => {
      const contentAdminUser: User = { ...mockUser, isContentAdmin: true }
      render(<Sidebar {...createDefaultProps({
        isAuthenticated: true,
        user: contentAdminUser,
      })} />)

      expect(screen.getByText('Content Moderation')).toBeInTheDocument()
      expect(screen.getByText('Announcements')).toBeInTheDocument()
      expect(screen.queryByText('User Admin')).not.toBeInTheDocument()
    })

    it('navigates to admin-content section when Content Moderation is clicked', () => {
      const adminUser: User = { ...mockUser, isAdmin: true }
      const onSectionChange = vi.fn()
      render(<Sidebar {...createDefaultProps({
        isAuthenticated: true,
        user: adminUser,
        onSectionChange,
      })} />)

      fireEvent.click(screen.getByText('Content Moderation'))
      expect(onSectionChange).toHaveBeenCalledWith('admin-content')
    })

    it('uses the authenticated glass rail styling on admin routes', () => {
      const adminUser: User = { ...mockUser, isAdmin: true }
      render(<Sidebar {...createDefaultProps({
        activeSection: 'admin-content',
        isAuthenticated: true,
        user: adminUser,
      })} />)

      expect(screen.getByRole('complementary')).toHaveClass('ff-auth-rail')
      expect(screen.getByText('Content Moderation').closest('button')).toHaveAttribute('aria-current', 'page')
    })
  })
})
