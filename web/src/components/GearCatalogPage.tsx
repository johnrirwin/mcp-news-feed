import { useState, useEffect, useCallback, useRef } from 'react';
import { searchGearCatalog, getPopularGear, getGearCatalogItem } from '../gearCatalogApi';
import type { GearCatalogItem, GearType } from '../gearCatalogTypes';
import { GEAR_TYPES, DRONE_TYPES, getCatalogItemDisplayName } from '../gearCatalogTypes';
import { useAuth } from '../hooks/useAuth';
import { GearDetailModal } from './GearDetailModal';
import { MobileFloatingControls } from './MobileFloatingControls';

interface GearCatalogPageProps {
  onAddToInventory?: (item: GearCatalogItem) => void;
}

// Gear type tab component
function GearTypeTab({ 
  label, 
  isActive, 
  onClick 
}: { 
  label: string; 
  isActive: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
        isActive
          ? 'ff-auth-chip ff-auth-chip-active'
          : 'ff-auth-chip'
      }`}
    >
      {label}
    </button>
  );
}

// Gear card for the catalog
function GearCard({ 
  item, 
  onAddToInventory,
  onOpenDetail,
  isAuthenticated,
}: { 
  item: GearCatalogItem; 
  onAddToInventory?: (item: GearCatalogItem) => void;
  onOpenDetail: (item: GearCatalogItem) => void;
  isAuthenticated: boolean;
}) {
  const typeLabel = GEAR_TYPES.find(t => t.value === item.gearType)?.label || item.gearType;

  const handleCardClick = () => {
    onOpenDetail(item);
  };

  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpenDetail(item);
    }
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToInventory?.(item);
  };
  
  return (
    <div 
      role="button"
      tabIndex={0}
      className="ff-auth-card ff-auth-card-hover cursor-pointer overflow-hidden rounded-[24px] p-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      aria-label={`View details for ${getCatalogItemDisplayName(item)}`}
    >
      <div className="flex gap-4 min-w-0">
        {/* Image */}
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={getCatalogItemDisplayName(item)}
            className="h-20 w-20 flex-shrink-0 rounded-[18px] object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-[18px] border border-white/10 bg-black/12">
            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-public text-lg font-semibold tracking-[-0.03em] text-white">
                {getCatalogItemDisplayName(item)}
              </h3>
              <p className="truncate text-sm text-slate-300/72">{item.brand}</p>
            </div>
            <span className="ff-auth-chip flex-shrink-0 text-xs">
              {typeLabel}
            </span>
          </div>

          {/* Description */}
          {item.description && (
            <p className="mt-2 line-clamp-2 text-sm text-slate-300/64">
              {item.description}
            </p>
          )}

          {/* Best For badges */}
          {item.bestFor && item.bestFor.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.bestFor.map(droneType => {
                const label = DRONE_TYPES.find(t => t.value === droneType)?.label || droneType;
                return (
                  <span 
                    key={droneType}
                    className="ff-auth-chip text-xs"
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          )}

          {/* Stats & Actions */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {item.usageCount} {item.usageCount === 1 ? 'pilot' : 'pilots'}
              </span>
            </div>

            {onAddToInventory && (
              <button
                onClick={handleAddClick}
                disabled={!isAuthenticated}
                title={isAuthenticated ? 'Add to your inventory' : 'Sign in to add to inventory'}
                className="ff-auth-cta-primary flex items-center gap-1 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function GearCatalogPage({ onAddToInventory }: GearCatalogPageProps) {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<GearType | null>(null);
  const [items, setItems] = useState<GearCatalogItem[]>([]);
  const [popularItems, setPopularItems] = useState<GearCatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GearCatalogItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isMobileControlsOpen, setIsMobileControlsOpen] = useState(false);
  const detailRequestRef = useRef(0);

  const handleOpenDetail = useCallback((item: GearCatalogItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
    const requestId = ++detailRequestRef.current;

    void getGearCatalogItem(item.id)
      .then((fullItem) => {
        if (requestId !== detailRequestRef.current) {
          return;
        }
        setSelectedItem((current) => {
          if (!current || current.id !== item.id) {
            return current;
          }
          return fullItem;
        });
      })
      .catch(() => {
        // Keep using the list payload if detail hydration fails.
      });
  }, []);

  const handleCloseDetail = useCallback(() => {
    detailRequestRef.current += 1;
    setIsDetailModalOpen(false);
    setSelectedItem(null);
  }, []);

  // Load popular items on mount
  useEffect(() => {
    setIsLoadingPopular(true);
    getPopularGear(undefined, 12)
      .then(response => setPopularItems(response.items))
      .catch(() => setPopularItems([]))
      .finally(() => setIsLoadingPopular(false));
  }, []);

  // Search handler
  const handleSearch = useCallback(async () => {
    setIsMobileControlsOpen(false);
    if (!searchQuery.trim() && !selectedType) {
      setHasSearched(false);
      setItems([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await searchGearCatalog({
        query: searchQuery.trim() || undefined,
        gearType: selectedType || undefined,
        limit: 50,
      });
      setItems(response.items);
      setTotalCount(response.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedType]);

  // Auto-search when type changes
  useEffect(() => {
    if (selectedType) {
      handleSearch();
    }
  }, [selectedType, handleSearch]);

  // Handle enter key in search
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Clear search and show popular
  const handleClearSearch = () => {
    setIsMobileControlsOpen(false);
    setSearchQuery('');
    setSelectedType(null);
    setHasSearched(false);
    setItems([]);
  };

  // Handle selecting "All Types" tab
  const handleSelectAllTypes = useCallback(async () => {
    setSelectedType(null);
    // If there's a search query, search with no type filter
    if (searchQuery.trim()) {
      setIsLoading(true);
      setError(null);
      setHasSearched(true);
      try {
        const response = await searchGearCatalog({
          query: searchQuery.trim(),
          gearType: undefined,
          limit: 50,
        });
        setItems(response.items);
        setTotalCount(response.totalCount);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      // No search query, reset to show popular items
      setHasSearched(false);
      setItems([]);
    }
  }, [searchQuery]);

  const displayItems = hasSearched ? items : popularItems;
  const showingPopular = !hasSearched;
  const controls = (
    <div className="ff-auth-toolbar">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="ff-auth-section-title">Gear Catalog</h1>
            <p className="ff-auth-page-subtitle mt-2 text-sm">
              Browse community-contributed FPV gear
            </p>
          </div>
          {!isAuthenticated && (
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Sign in to add gear to your inventory
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300/72"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by brand, model, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="ff-auth-input w-full rounded-xl py-2.5 pl-10 pr-4"
            />
          </div>
          <button
            onClick={handleSearch}
            className="ff-auth-cta-primary px-4 py-2"
          >
            Search
          </button>
          {hasSearched && (
            <button
              onClick={handleClearSearch}
              className="ff-auth-cta-secondary px-4 py-2"
            >
              Clear
            </button>
          )}
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
          <GearTypeTab
            label="All Types"
            isActive={selectedType === null}
            onClick={handleSelectAllTypes}
          />
          {GEAR_TYPES.map(type => (
            <GearTypeTab
              key={type.value}
              label={type.label}
              isActive={selectedType === type.value}
              onClick={() => setSelectedType(type.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative flex-1 min-h-0 flex flex-col overflow-hidden">
      <div className="hidden md:block flex-shrink-0">{controls}</div>

      {/* Content */}
      <div
        className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain overflow-x-hidden pt-24 md:pt-0"
        onScroll={(event) => {
          setIsMobileControlsOpen((prev) => (prev ? false : prev));

          // Dismiss keyboard only on touch/coarse-pointer devices and only
          // when a form control inside this scroll region is focused.
          if (typeof window === 'undefined') return;
          if (!window.matchMedia || !window.matchMedia('(pointer: coarse)').matches) return;

          const activeElement = document.activeElement;
          if (!(activeElement instanceof HTMLElement) || activeElement === document.body) return;

          const scrollContainer = event.currentTarget;
          if (!scrollContainer.contains(activeElement)) return;

          const tagName = activeElement.tagName;
          if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') {
            activeElement.blur();
          }
        }}
      >
      <div className="p-6">
        {/* Section header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-public text-xl font-semibold tracking-[-0.03em] text-white">
            {showingPopular ? (
              <>
                <span className="text-primary-300">Popular Gear</span>
                <span className="ml-2 text-sm font-normal text-slate-300/68">
                  Browse what other pilots are using
                </span>
              </>
            ) : (
              <>
                Search Results
                <span className="ml-2 text-sm font-normal text-slate-300/68">
                  {totalCount} {totalCount === 1 ? 'item' : 'items'} found
                </span>
              </>
            )}
          </h2>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/12 p-4 text-red-200">
            {error}
          </div>
        )}

        {/* Loading state */}
        {(isLoading || isLoadingPopular) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="ff-auth-card animate-pulse rounded-[24px] p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-slate-700 rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-slate-700 rounded w-3/4" />
                    <div className="h-4 bg-slate-700 rounded w-1/2" />
                    <div className="h-4 bg-slate-700 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isLoadingPopular && displayItems.length === 0 && (
          <div className="ff-auth-empty-state py-12 text-center">
            <div className="ff-auth-glass-panel mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="font-public text-xl font-semibold tracking-[-0.03em] text-white">
              {hasSearched ? 'No gear found' : 'No popular gear yet'}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-slate-300/74">
              {hasSearched
                ? 'Try adjusting your search terms or filters'
                : 'Be the first to contribute to the gear catalog!'}
            </p>
          </div>
        )}

        {/* Results grid */}
        {!isLoading && !isLoadingPopular && displayItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayItems.map(item => (
              <GearCard
                key={item.id}
                item={item}
                onAddToInventory={onAddToInventory}
                onOpenDetail={handleOpenDetail}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        )}

        {/* Community contribution note */}
        <div className="ff-auth-card mt-8 rounded-[24px] p-4">
          <div className="flex gap-3">
            <div className="ff-auth-glass-panel flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h3 className="font-public text-lg font-semibold tracking-[-0.03em] text-white">Contribute to the Catalog</h3>
              <p className="mt-1 text-sm text-slate-300/74">
                Don't see your gear? When you add items to your inventory, they're automatically 
                added to the community catalog for others to find. Help grow the database!
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>

      <MobileFloatingControls
        label="Catalog Filters"
        isOpen={isMobileControlsOpen}
        onToggle={() => setIsMobileControlsOpen((prev) => !prev)}
      >
        {controls}
      </MobileFloatingControls>

      {/* Gear Detail Modal */}
      {selectedItem && (
        <GearDetailModal
          item={selectedItem}
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetail}
          onAddToInventory={onAddToInventory}
          isAuthenticated={isAuthenticated}
        />
      )}
    </div>
  );
}
