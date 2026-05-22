import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getActiveAnnouncements } from '../announcementApi';
import type { Announcement, AnnouncementPlacement } from '../announcementTypes';

function getDismissalStorageKey(announcement: Announcement): string {
  return `flyingforge:announcement:dismissed:${announcement.id}:${announcement.updatedAt}`;
}

function isDismissed(announcement: Announcement): boolean {
  return localStorage.getItem(getDismissalStorageKey(announcement)) === 'true';
}

interface AnnouncementBannerProps {
  announcement: Announcement;
  onDismiss?: () => void;
  className?: string;
}

export function AnnouncementBanner({ announcement, onDismiss, className = '' }: AnnouncementBannerProps) {
  const ctaUrl = announcement.ctaUrl?.trim();
  const ctaLabel = announcement.ctaLabel?.trim();

  return (
    <section className={`ff-auth-glass-panel rounded-[28px] p-4 md:p-5 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="ff-auth-chip mb-2 inline-flex items-center gap-2 text-primary-100">
            Announcement
          </div>
          <h2 className="font-public text-xl font-semibold tracking-[-0.03em] text-white md:text-2xl">{announcement.title}</h2>
          <p className="mt-2 whitespace-pre-line text-sm md:text-base text-slate-100/88">{announcement.body}</p>
          {ctaUrl && ctaLabel && (
            <div className="mt-4">
              {ctaUrl.startsWith('/') ? (
                <Link
                  to={ctaUrl}
                  className="ff-auth-cta-primary inline-flex items-center gap-2 px-4 py-2 text-sm"
                >
                  {ctaLabel}
                  <span aria-hidden="true">→</span>
                </Link>
              ) : (
                <a
                  href={ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ff-auth-cta-primary inline-flex items-center gap-2 px-4 py-2 text-sm"
                >
                  {ctaLabel}
                  <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          )}
        </div>

        {announcement.dismissible && onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss announcement"
            className="shrink-0 rounded-lg p-2 text-slate-300 transition-colors hover:bg-slate-800/60 hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}

interface AnnouncementPlacementBannerProps {
  placement: AnnouncementPlacement;
  className?: string;
}

export function AnnouncementPlacementBanner({ placement, className = '' }: AnnouncementPlacementBannerProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [, setDismissedVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;

    getActiveAnnouncements(placement)
      .then((response) => {
        if (!cancelled) {
          setAnnouncements(response.announcements || []);
        }
      })
      .catch((err) => {
        if (import.meta.env.MODE !== 'test') {
          console.error('Failed to load announcements:', err);
        }
        if (!cancelled) {
          setAnnouncements([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [placement]);

  const visibleAnnouncement =
    announcements.find((announcement) => !announcement.dismissible || !isDismissed(announcement)) ?? null;

  if (!visibleAnnouncement) {
    return null;
  }

  return (
    <AnnouncementBanner
      announcement={visibleAnnouncement}
      className={className}
      onDismiss={
        visibleAnnouncement.dismissible
          ? () => {
              localStorage.setItem(getDismissalStorageKey(visibleAnnouncement), 'true');
              setDismissedVersion((current) => current + 1);
            }
          : undefined
      }
    />
  );
}
