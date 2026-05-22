import { useEffect, useMemo, useState } from 'react';
import { getAircraftImageUrl } from '../aircraftApi';
import { getBatteries } from '../batteryApi';
import { AIRCRAFT_TYPES, type Aircraft } from '../aircraftTypes';
import { formatCapacity, formatCellCount, type Battery } from '../batteryTypes';
import type { FeedItem, SourceInfo } from '../types';
import { AnnouncementPlacementBanner } from './AnnouncementBanner';

interface DashboardProps {
  recentAircraft: Aircraft[];
  recentNews: FeedItem[];
  sources: SourceInfo[];
  isAircraftLoading: boolean;
  isNewsLoading: boolean;
  onAddAircraft: () => void;
  onViewAllNews: () => void;
  onViewAllAircraft: () => void;
  onViewAllBatteries: () => void;
  onSelectAircraft: (aircraft: Aircraft) => void;
  onSelectNewsItem: (item: FeedItem) => void;
}

function formatAircraftTypeLabel(type: Aircraft['type']): string {
  return AIRCRAFT_TYPES.find((option) => option.value === type)?.label ?? type.replace('_', ' ');
}

function formatShortDate(dateString?: string): string {
  if (!dateString) return 'Recently updated';

  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return 'Recently updated';

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: parsed.getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
  });
}

function formatTimeAgo(dateString?: string): string {
  if (!dateString) return 'Just added';

  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return 'Recently updated';

  const diffMs = Date.now() - parsed.getTime();
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (minutes < 60) return `${Math.max(minutes, 1)}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatShortDate(dateString);
}

function getBatteryUsageScore(battery: Battery): number {
  const cycles = battery.total_cycles ?? 0;
  const normalizedCycles = Math.min(cycles, 120) / 120;

  if (!battery.last_logged_date) {
    return Math.max(0.22, normalizedCycles * 0.75);
  }

  const daysSinceLog = Math.max(0, Math.floor((Date.now() - new Date(battery.last_logged_date).getTime()) / 86400000));
  const freshness = Math.max(0.28, 1 - Math.min(daysSinceLog, 45) / 45);
  return Math.max(0.24, Math.min(0.96, normalizedCycles * 0.55 + freshness * 0.45));
}

function SectionLinkButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ff-auth-chip hover:text-white"
    >
      {label}
    </button>
  );
}

function LargeAircraftCard({ aircraft, onClick }: { aircraft: Aircraft; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ff-auth-card ff-auth-card-hover flex h-full flex-col p-5 text-left"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="ff-auth-chip mb-3">{formatAircraftTypeLabel(aircraft.type)}</div>
          <h3 className="font-public text-[1.75rem] font-semibold leading-none tracking-[-0.045em] text-white">
            {aircraft.name}
          </h3>
          {aircraft.nickname && (
            <p className="mt-2 text-sm text-slate-200/78">“{aircraft.nickname}”</p>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-[22px] border border-white/12 bg-black/12">
        {aircraft.hasImage ? (
          <img
            src={getAircraftImageUrl(aircraft.id)}
            alt={aircraft.name}
            className="h-52 w-full object-cover"
          />
        ) : (
          <div className="flex h-52 w-full items-center justify-center bg-white/6 text-6xl">
            {AIRCRAFT_TYPES.find((option) => option.value === aircraft.type)?.icon ?? '🚁'}
          </div>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-slate-300/68">Profile</p>
          <p className="mt-1 font-public text-lg font-semibold tracking-[-0.03em] text-white">
            {formatAircraftTypeLabel(aircraft.type)}
          </p>
        </div>
        <div>
          <p className="text-slate-300/68">Updated</p>
          <p className="mt-1 font-public text-lg font-semibold tracking-[-0.03em] text-white">
            {formatShortDate(aircraft.updatedAt)}
          </p>
        </div>
      </div>
    </button>
  );
}

function CompactAircraftCard({ aircraft, onClick }: { aircraft: Aircraft; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ff-auth-card ff-auth-card-hover flex h-full flex-col p-4 text-left"
    >
      <div className="overflow-hidden rounded-[18px] border border-white/12 bg-black/12">
        {aircraft.hasImage ? (
          <img
            src={getAircraftImageUrl(aircraft.id)}
            alt={aircraft.name}
            className="h-36 w-full object-cover"
          />
        ) : (
          <div className="flex h-36 w-full items-center justify-center bg-white/6 text-5xl">
            {AIRCRAFT_TYPES.find((option) => option.value === aircraft.type)?.icon ?? '🚁'}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <h3 className="font-public text-[1.35rem] font-semibold leading-none tracking-[-0.04em] text-white">
          {aircraft.name}
        </h3>
        {aircraft.nickname && (
          <p className="mt-1 text-sm text-slate-200/76">{aircraft.nickname}</p>
        )}

        <div className="mt-auto grid grid-cols-2 gap-3 pt-4 text-sm">
          <div>
            <p className="text-slate-300/64">Type</p>
            <p className="mt-1 font-medium text-white">{formatAircraftTypeLabel(aircraft.type)}</p>
          </div>
          <div>
            <p className="text-slate-300/64">Updated</p>
            <p className="mt-1 font-medium text-white">{formatTimeAgo(aircraft.updatedAt)}</p>
          </div>
        </div>
      </div>
    </button>
  );
}

function AircraftSkeletonCard({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`ff-auth-card animate-pulse ${compact ? 'p-4' : 'p-5'}`}>
      <div className={`rounded-[20px] bg-white/10 ${compact ? 'h-36' : 'h-52'}`} />
      <div className="mt-4 space-y-3">
        <div className="h-5 w-28 rounded-full bg-white/12" />
        <div className="h-8 w-2/3 rounded-xl bg-white/12" />
        <div className="h-4 w-1/2 rounded-xl bg-white/10" />
      </div>
    </div>
  );
}

function EmptyHangarState({ onAddAircraft }: { onAddAircraft: () => void }) {
  return (
    <div className="ff-auth-empty-state flex min-h-[320px] flex-col items-center justify-center px-6 py-12">
      <div className="ff-auth-glass-panel mb-5 flex h-16 w-16 items-center justify-center rounded-full text-primary-200">
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </div>
      <h3 className="font-public text-2xl font-semibold tracking-[-0.04em] text-white">Build your first aircraft</h3>
      <p className="mt-3 max-w-md text-center text-sm text-slate-300/76">
        Add a quad, wing, or cinematic rig to start building out your hangar, components, and tuned gear.
      </p>
      <button type="button" onClick={onAddAircraft} className="ff-auth-cta-primary mt-6">
        Add New Aircraft
      </button>
    </div>
  );
}

function BatteryTrackerPanel({
  batteries,
  isLoading,
  onViewAllBatteries,
}: {
  batteries: Battery[];
  isLoading: boolean;
  onViewAllBatteries: () => void;
}) {
  return (
    <section className="ff-auth-card p-5 md:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="ff-auth-kicker">Power overview</p>
          <h2 className="ff-auth-section-title mt-2">Battery Tracker</h2>
        </div>
        <SectionLinkButton label="Open Tracker" onClick={onViewAllBatteries} />
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse space-y-2 rounded-2xl border border-white/10 bg-white/6 p-4">
              <div className="h-5 w-40 rounded-xl bg-white/12" />
              <div className="h-3 w-28 rounded-xl bg-white/10" />
              <div className="h-2 w-full rounded-full bg-white/10" />
            </div>
          ))
        ) : batteries.length === 0 ? (
          <div className="ff-auth-empty-state px-4 py-8 text-left">
            <h3 className="font-public text-lg font-semibold tracking-[-0.03em] text-white">No battery packs yet</h3>
            <p className="mt-2 text-sm text-slate-300/72">
              Add packs and health logs to keep cycle history, labels, and field-readiness all in one place.
            </p>
            <button type="button" onClick={onViewAllBatteries} className="ff-auth-cta-secondary mt-4">
              Open Batteries
            </button>
          </div>
        ) : (
          batteries.map((battery) => {
            const usageScore = Math.round(getBatteryUsageScore(battery) * 100);
            return (
              <div key={battery.id} className="rounded-[22px] border border-white/10 bg-white/6 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-public text-lg font-semibold tracking-[-0.03em] text-white">
                      {battery.name || battery.battery_code}
                    </h3>
                    <p className="mt-1 text-sm text-slate-300/72">
                      {formatCellCount(battery.cells)} • {formatCapacity(battery.capacity_mah)} • {battery.total_cycles ?? 0} cycles
                    </p>
                  </div>
                  <div className="text-right text-sm text-slate-200/78">
                    {battery.last_logged_date ? formatTimeAgo(battery.last_logged_date) : 'No logs yet'}
                  </div>
                </div>
                <div className="ff-auth-progress-track mt-3">
                  <div className="ff-auth-progress-fill" style={{ width: `${usageScore}%` }} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

function RecentHighlightsPanel({
  items,
  sources,
  isLoading,
  onViewAllNews,
  onSelectNewsItem,
}: {
  items: FeedItem[];
  sources: SourceInfo[];
  isLoading: boolean;
  onViewAllNews: () => void;
  onSelectNewsItem: (item: FeedItem) => void;
}) {
  const sourceMap = useMemo(() => new Map(sources.map((source) => [source.id, source])), [sources]);

  return (
    <section className="ff-auth-card p-5 md:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="ff-auth-kicker">Field intel</p>
          <h2 className="ff-auth-section-title mt-2">Recent Highlights</h2>
        </div>
        <SectionLinkButton label="View feed" onClick={onViewAllNews} />
      </div>

      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-2xl border border-white/10 bg-white/6 p-3">
              <div className="flex gap-3">
                <div className="h-12 w-12 rounded-xl bg-white/12" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-2/3 rounded-xl bg-white/12" />
                  <div className="h-3 w-1/2 rounded-xl bg-white/10" />
                </div>
              </div>
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="ff-auth-empty-state px-4 py-8 text-left">
            <h3 className="font-public text-lg font-semibold tracking-[-0.03em] text-white">No recent highlights</h3>
            <p className="mt-2 text-sm text-slate-300/72">
              Refresh the feed to surface the latest drone news, creator drops, and community releases.
            </p>
          </div>
        ) : (
          items.slice(0, 4).map((item) => {
            const source = sourceMap.get(item.source);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectNewsItem(item)}
                className="flex w-full items-center gap-3 rounded-[20px] border border-white/10 bg-white/6 p-3 text-left transition hover:border-white/18 hover:bg-white/10"
              >
                <div className="h-14 w-14 overflow-hidden rounded-2xl border border-white/10 bg-black/16">
                  {item.media?.imageUrl ? (
                    <img src={item.media.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300/70">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 font-medium text-white">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-300/68">
                    {source?.name || item.source} • {formatTimeAgo(item.publishedAt)}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}

export function Dashboard({
  recentAircraft,
  recentNews,
  sources,
  isAircraftLoading,
  isNewsLoading,
  onAddAircraft,
  onViewAllNews,
  onViewAllAircraft,
  onViewAllBatteries,
  onSelectAircraft,
  onSelectNewsItem,
}: DashboardProps) {
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const [isBatteryLoading, setIsBatteryLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setIsBatteryLoading(true);
    getBatteries({ limit: 4, sort_by: 'logged', sort_order: 'desc' })
      .then((response) => {
        if (!cancelled) {
          setBatteries(response.batteries ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setBatteries([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsBatteryLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const featuredAircraft = recentAircraft.slice(0, 2);
  const supportAircraft = recentAircraft.slice(2, 5);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-[1320px] px-4 pb-24 pt-6 md:px-6 md:pb-8 md:pt-8">
        <header className="mb-6 md:mb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="ff-auth-page-title">My Hangar</h1>
              <p className="ff-auth-page-subtitle mt-3 max-w-2xl text-sm md:text-base">
                Keep aircraft, batteries, and field-ready highlights in one cockpit-inspired workspace.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={onAddAircraft} className="ff-auth-cta-primary">
                Add New Aircraft
              </button>
              <button type="button" onClick={onViewAllAircraft} className="ff-auth-cta-secondary">
                View All Aircraft
              </button>
            </div>
          </div>
        </header>

        <AnnouncementPlacementBanner placement="dashboard" className="mb-6 md:mb-8" />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_320px]">
          <section className="ff-auth-card p-5 md:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="ff-auth-kicker">Fleet overview</p>
                <h2 className="ff-auth-section-title mt-2">Aircraft Cards</h2>
              </div>
              {recentAircraft.length > 0 && (
                <SectionLinkButton label="Manage hangar" onClick={onViewAllAircraft} />
              )}
            </div>

            {isAircraftLoading ? (
              <div className="space-y-4">
                <div className="grid gap-4 xl:grid-cols-2">
                  <AircraftSkeletonCard />
                  <AircraftSkeletonCard />
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <AircraftSkeletonCard compact />
                  <AircraftSkeletonCard compact />
                  <AircraftSkeletonCard compact />
                </div>
              </div>
            ) : recentAircraft.length === 0 ? (
              <EmptyHangarState onAddAircraft={onAddAircraft} />
            ) : (
              <div className="space-y-4 md:space-y-5">
                <div className="grid gap-4 xl:grid-cols-2">
                  {featuredAircraft.map((aircraft) => (
                    <LargeAircraftCard
                      key={aircraft.id}
                      aircraft={aircraft}
                      onClick={() => onSelectAircraft(aircraft)}
                    />
                  ))}
                </div>
                {supportAircraft.length > 0 && (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {supportAircraft.map((aircraft) => (
                      <CompactAircraftCard
                        key={aircraft.id}
                        aircraft={aircraft}
                        onClick={() => onSelectAircraft(aircraft)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>

          <div className="space-y-6">
            <BatteryTrackerPanel
              batteries={batteries}
              isLoading={isBatteryLoading}
              onViewAllBatteries={onViewAllBatteries}
            />
            <RecentHighlightsPanel
              items={recentNews}
              sources={sources}
              isLoading={isNewsLoading}
              onViewAllNews={onViewAllNews}
              onSelectNewsItem={onSelectNewsItem}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
