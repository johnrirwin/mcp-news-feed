import { type ReactNode, memo } from 'react';
import type { AppSection } from '../equipmentTypes';
import type { User } from '../authTypes';

interface SidebarProps {
  activeSection: AppSection;
  onSectionChange: (section: AppSection) => void;
  isAuthenticated: boolean;
  user: User | null;
  authLoading: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  isMobileMenuOpen: boolean;
  onMobileMenuClose: () => void;
}

export const Sidebar = memo(function Sidebar({
  activeSection,
  onSectionChange,
  isAuthenticated,
  user,
  authLoading,
  onSignIn,
  onSignOut,
  isMobileMenuOpen,
  onMobileMenuClose,
}: SidebarProps) {
  const isPublicShell = !isAuthenticated;
  const isAuthenticatedShell = isAuthenticated;

  const handleNavigation = (section: AppSection) => {
    onSectionChange(section);
    onMobileMenuClose();
  };

  const publicNavigation: Array<{ section: AppSection; label: string; icon: ReactNode }> = [
    {
      section: 'home',
      label: 'Home',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      section: 'news',
      label: 'News',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
    },
    {
      section: 'equipment',
      label: 'Shop',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      section: 'gear-catalog',
      label: 'Gear',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      section: 'builds',
      label: 'Builds',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3h6m-6 18h6M5 7h14M5 17h14M7 7v10m10-10v10M9 9h6v6H9V9z" />
        </svg>
      ),
    },
  ];

  const authenticatedPublicNavigation = publicNavigation.filter(({ section }) => section !== 'home');

  const authenticatedPrivateNavigation: Array<{ section: AppSection; label: string; icon: ReactNode }> = [
    {
      section: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      section: 'social',
      label: 'Social',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      section: 'inventory',
      label: 'My Inventory',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      section: 'aircraft',
      label: 'My Aircraft',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
    },
    {
      section: 'my-builds',
      label: 'My Builds',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M6 7l1-3h10l1 3M5 7v13h14V7M9 11h6m-6 4h4" />
        </svg>
      ),
    },
    {
      section: 'radio',
      label: 'My Radio',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      ),
    },
    {
      section: 'batteries',
      label: 'My Batteries',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h14a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2zm16 3h2m-2 0v2" />
        </svg>
      ),
    },
  ];

  const adminNavigation: Array<{ section: AppSection; label: string; icon: ReactNode }> = [
    ...(user?.isAdmin || user?.isContentAdmin || user?.isGearAdmin
      ? [{
          section: 'admin-content' as const,
          label: 'Content Moderation',
          icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
        }]
      : []),
    ...(user?.isAdmin || user?.isContentAdmin || user?.isGearAdmin
      ? [{
          section: 'admin-announcements' as const,
          label: 'Announcements',
          icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.055A9.001 9.001 0 1020.945 15M11 5.055A9.003 9.003 0 0119 12h-8V5.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 13l4 4m0 0h-4m4 0v-4" />
            </svg>
          ),
        }]
      : []),
    ...(user?.isAdmin
      ? [{
          section: 'admin-users' as const,
          label: 'User Admin',
          icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
        }]
      : []),
  ];

  const NavItem = ({
    section,
    icon,
    label,
    compact = false,
  }: {
    section: AppSection;
    icon: ReactNode;
    label: string;
    compact?: boolean;
  }) => {
    const isActive = activeSection === section;

    if (compact) {
      return (
        <button
          type="button"
          onClick={() => handleNavigation(section)}
          aria-current={isActive ? 'page' : undefined}
          className={`group ff-public-nav-item ${isActive ? 'ff-public-nav-item-active' : ''}`}
        >
          {isActive && (
            <span className="absolute left-0 top-1/2 h-11 w-1 -translate-y-1/2 rounded-full bg-gradient-to-b from-violet-300 via-primary-400 to-sky-300 shadow-[0_0_18px_rgba(96,165,250,0.65)]" />
          )}
          <span className={`ff-public-nav-icon ${isActive ? 'ff-public-nav-icon-active' : ''}`}>
            {icon}
          </span>
          <span className="text-sm font-medium tracking-tight">{label}</span>
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={() => handleNavigation(section)}
        aria-current={isActive ? 'page' : undefined}
        className={isAuthenticatedShell
          ? `ff-auth-nav-item ${isActive ? 'ff-auth-nav-item-active' : ''}`
          : `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
              isActive
                ? 'bg-slate-800 text-white shadow-[inset_0_0_0_1px_rgba(96,165,250,0.18)]'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
      >
        {isAuthenticatedShell ? (
          <>
            <span className={`ff-auth-nav-icon ${isActive ? 'ff-auth-nav-icon-active' : ''}`}>
              {icon}
            </span>
            <span className="flex-1 font-public text-sm font-semibold tracking-[-0.025em]">{label}</span>
          </>
        ) : (
          <>
            {icon}
            <span className="flex-1 font-medium">{label}</span>
          </>
        )}
      </button>
    );
  };

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onMobileMenuClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen supports-[height:100dvh]:h-[100dvh] md:static md:h-auto md:flex-shrink-0 ${
          isPublicShell
            ? 'ff-public-shell ff-public-rail w-72 md:w-[210px]'
            : isAuthenticatedShell
              ? 'ff-auth-shell ff-auth-rail w-72 md:w-[236px]'
              : 'w-72 border-r border-slate-800 bg-slate-900 md:w-64'
        } overflow-y-auto overflow-x-hidden overscroll-y-contain [-webkit-overflow-scrolling:touch] transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex min-h-full w-full flex-col">
          <div className={`px-4 pb-3 pt-4 ${
            isPublicShell
              ? 'border-b border-white/10'
              : isAuthenticatedShell
                ? 'border-b border-white/10'
                : 'border-b border-slate-800'
          }`}>
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleNavigation(isAuthenticated ? 'dashboard' : 'home')}
                className={`text-left transition-colors ${
                  isPublicShell
                    ? 'font-public text-[1.9rem] font-bold leading-none tracking-[-0.05em] text-white hover:text-primary-100'
                    : isAuthenticatedShell
                      ? 'font-public text-[1.82rem] font-bold leading-none tracking-[-0.05em] text-white hover:text-primary-100'
                    : 'text-xl font-semibold tracking-tight text-white hover:text-primary-300'
                }`}
              >
                FlyingForge
              </button>
              <button
                type="button"
                onClick={onMobileMenuClose}
                className={`rounded-lg p-2 transition-colors md:hidden ${
                  isPublicShell
                    ? 'text-slate-300 hover:bg-white/10 hover:text-white'
                    : isAuthenticatedShell
                      ? 'text-slate-300 hover:bg-white/10 hover:text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {isPublicShell ? (
            <>
              <div className="px-4 py-6">
                <nav className="mx-auto flex w-full max-w-[116px] flex-col gap-3">
                  {publicNavigation.map((item) => (
                    <NavItem key={item.section} {...item} compact />
                  ))}
                </nav>
              </div>

              <div className="flex-1" />

              <div className="px-4 pb-4">
                <div className="ff-public-glass-panel rounded-[28px] p-4">
                  {authLoading ? (
                    <div className="flex items-center justify-center py-5">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-500/70 border-t-primary-300" />
                    </div>
                  ) : (
                    <>
                      <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-300/65">
                        Ready to launch?
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-200/80">
                        Sign in to start tracking aircraft, organize your gear, and build your flying hub.
                      </p>
                      <button
                        type="button"
                        onClick={onSignIn}
                        className="ff-public-cta-primary mt-4 w-full px-4 py-3 text-sm"
                      >
                        Sign In
                      </button>
                    </>
                  )}
                </div>
              </div>
            </>
	          ) : (
	            <>
	              <div className="px-4 py-4">
	                <nav className={`flex flex-col ${isAuthenticatedShell ? 'gap-2' : 'gap-1'}`}>
	                  {authenticatedPublicNavigation.map((item) => (
	                    <NavItem key={item.section} {...item} />
	                  ))}
	
	                  <div className={`my-2 ${isAuthenticatedShell ? 'border-t border-white/10' : 'border-t border-slate-800'}`} />
	
	                  {authenticatedPrivateNavigation.map((item) => (
	                    <NavItem key={item.section} {...item} />
	                  ))}
	
	                  {adminNavigation.length > 0 && <div className={`my-2 ${isAuthenticatedShell ? 'border-t border-white/10' : 'border-t border-slate-800'}`} />}
	
	                  {adminNavigation.map((item) => (
	                    <NavItem key={item.section} {...item} />
	                  ))}
	                </nav>
              </div>

              <div className="flex-1" />

	              <div className={`${isAuthenticatedShell ? 'border-t border-white/10 p-4' : 'border-t border-slate-800 p-4'}`}>
	                {authLoading ? (
	                  <div className="flex items-center justify-center py-2">
	                    <div className={`h-5 w-5 animate-spin rounded-full border-2 ${isAuthenticatedShell ? 'border-white/30 border-t-primary-300' : 'border-slate-600 border-t-primary-500'}`} />
	                  </div>
	                ) : isAuthenticated && user ? (
	                  <div className={`space-y-3 ${isAuthenticatedShell ? 'ff-auth-glass-panel rounded-[24px] p-3.5' : ''}`}>
	                    <button
	                      type="button"
	                      onClick={() => handleNavigation('profile')}
	                      className={`-m-2 flex w-full items-center gap-3 rounded-xl p-2 transition-colors ${
                          isAuthenticatedShell
                            ? 'hover:bg-white/10'
                            : 'hover:bg-slate-800'
                        }`}
	                    >
	                      {user.avatarUrl ? (
	                        <img
	                          src={user.avatarUrl}
	                          alt={user.displayName || 'User'}
	                          className={`h-9 w-9 flex-shrink-0 rounded-full ${isAuthenticatedShell ? 'ring-2 ring-white/10' : ''}`}
	                        />
	                      ) : (
	                        <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${isAuthenticatedShell ? 'bg-white/12 ring-1 ring-white/14' : 'bg-primary-600'}`}>
	                          <span className="text-sm font-medium text-white">
	                            {(user.displayName || user.email || '?')[0].toUpperCase()}
	                          </span>
	                        </div>
	                      )}
	                      <div className="min-w-0 flex-1 text-left">
	                        <div className={`truncate text-sm text-white ${isAuthenticatedShell ? 'font-public font-semibold tracking-[-0.02em]' : 'font-medium'}`}>
	                          {user.displayName || user.email}
	                        </div>
	                        {user.displayName && user.email && (
	                          <div className={`truncate text-xs ${isAuthenticatedShell ? 'text-slate-300/70' : 'text-slate-500'}`}>{user.email}</div>
	                        )}
	                      </div>
	                    </button>
	                    <button
	                      type="button"
	                      onClick={onSignOut}
	                      className={isAuthenticatedShell
                        ? 'ff-auth-cta-secondary w-full gap-2 px-3 py-2.5 text-sm'
                        : 'flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white'}
	                    >
	                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
	                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                ) : (
	                  <button
	                    type="button"
	                    onClick={onSignIn}
	                    className={isAuthenticatedShell
                      ? 'ff-auth-cta-primary w-full gap-2 px-4 py-2.5 text-sm'
                      : 'flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700'}
	                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign In
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
});
