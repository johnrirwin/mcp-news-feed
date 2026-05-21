import { describe, it, expect, vi } from 'vitest'
import { fireEvent, screen } from '@testing-library/react'
import { render } from '../test/test-utils'
import { Homepage } from './Homepage'

vi.mock('./AnnouncementBanner', () => ({
  AnnouncementPlacementBanner: () => null,
}))

describe('Homepage', () => {
  it('renders the hero headline, CTAs, and feature section', () => {
    render(<Homepage onSignIn={vi.fn()} onExploreNews={vi.fn()} />)

    expect(screen.getByRole('heading', { name: /Build it\.Fly it\.Share it\./i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Get Started/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Explore News Feed/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Everything you need for the hobby/i })).toBeInTheDocument()
    expect(screen.getByText('Track Your Aircraft')).toBeInTheDocument()
    expect(screen.getByText('Manage Your Gear')).toBeInTheDocument()
    expect(screen.getByText('Connect with Pilots')).toBeInTheDocument()
  })

  it('calls onSignIn when Get Started is clicked', () => {
    const onSignIn = vi.fn()
    render(<Homepage onSignIn={onSignIn} onExploreNews={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: /Get Started/i }))

    expect(onSignIn).toHaveBeenCalledTimes(1)
  })

  it('calls onExploreNews when Explore News Feed is clicked', () => {
    const onExploreNews = vi.fn()
    render(<Homepage onSignIn={vi.fn()} onExploreNews={onExploreNews} />)

    fireEvent.click(screen.getByRole('button', { name: /Explore News Feed/i }))

    expect(onExploreNews).toHaveBeenCalledTimes(1)
  })
})
