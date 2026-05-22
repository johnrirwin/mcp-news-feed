import type { InventoryItem } from '../equipmentTypes';
import { EQUIPMENT_CATEGORIES } from '../equipmentTypes';

interface InventoryCardProps {
  item: InventoryItem;
  onOpen: (item: InventoryItem) => void;
}

export function InventoryCard({ item, onOpen }: InventoryCardProps) {
  const category = EQUIPMENT_CATEGORIES.find(c => c.value === item.category);

  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(item)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen(item);
        }
      }}
      aria-label={`Edit ${item.name}`}
      className="ff-auth-card ff-auth-card-hover cursor-pointer rounded-[24px] p-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
    >
      <div className="flex gap-4">
        {/* Image */}
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-[18px] border border-white/10 bg-black/12">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-400/70">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="ff-auth-chip text-[11px]">
                {category?.label || item.category}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="mb-1 line-clamp-1 font-public text-lg font-semibold tracking-[-0.03em] text-white">
            {item.name}
          </h3>

          {/* Manufacturer & price */}
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-300/72">
            {item.manufacturer && <span>{item.manufacturer}</span>}
            {item.purchasePrice && (
              <>
                {item.manufacturer && <span>•</span>}
                <span className="text-primary-400">{formatPrice(item.purchasePrice)}</span>
              </>
            )}
            {item.purchaseSeller && (
              <>
                <span>•</span>
                <span>from {item.purchaseSeller}</span>
              </>
            )}
          </div>

          {/* Notes */}
          {item.notes && (
            <p className="mb-2 line-clamp-1 text-sm text-slate-300/62">
              {item.notes}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wide text-slate-300/58">Quantity</span>
              <span className="text-white font-semibold">{item.quantity}</span>
            </div>
            <div className="text-xs text-slate-300/58">
              Click to edit
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface InventoryListProps {
  items: InventoryItem[];
  isLoading: boolean;
  hasLoaded: boolean;
  error: string | null;
  onOpenItem: (item: InventoryItem) => void;
  mobileTopInset?: boolean;
  onListScroll?: () => void;
}

export function InventoryList({
  items,
  isLoading,
  hasLoaded,
  error,
  onOpenItem,
  mobileTopInset = false,
  onListScroll,
}: InventoryListProps) {
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="ff-auth-empty-state max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="font-public text-xl font-semibold tracking-[-0.03em] text-white">Failed to Load Inventory</h3>
          <p className="mt-2 text-sm text-slate-300/74">{error}</p>
        </div>
      </div>
    );
  }

  // Only show skeleton on initial load (never loaded yet), not when filtering
  if (isLoading && !hasLoaded) {
    return (
      <div className="flex-1 p-6 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="ff-auth-card animate-pulse rounded-[24px] p-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-slate-700 rounded-lg" />
              <div className="flex-1 space-y-3">
                <div className="flex gap-2">
                  <div className="w-16 h-5 bg-slate-700 rounded" />
                  <div className="w-12 h-5 bg-slate-700 rounded" />
                </div>
                <div className="h-5 bg-slate-700 rounded w-2/3" />
                <div className="h-4 bg-slate-700 rounded w-1/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!isLoading && items.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="ff-auth-empty-state max-w-md">
          <div className="ff-auth-glass-panel mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="font-public text-xl font-semibold tracking-[-0.035em] text-white">No Gear Yet</h3>
          <p className="mt-2 text-sm text-slate-300/74">
            Start building your inventory by adding equipment from the Equipment section or manually.
          </p>
        </div>
      </div>
    );
  }

  // Group items by category
  const itemsByCategory = items.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, InventoryItem[]>);

  // Sort categories by the order in EQUIPMENT_CATEGORIES
  const sortedCategories = EQUIPMENT_CATEGORIES
    .filter(cat => itemsByCategory[cat.value])
    .map(cat => ({
      value: cat.value,
      label: cat.label,
      items: itemsByCategory[cat.value],
    }));

  return (
    <div
      className={`flex-1 min-h-0 overflow-y-auto overscroll-y-contain p-4 md:p-6 relative ${mobileTopInset ? 'pt-24 md:pt-6' : ''}`}
      onScroll={(event) => {
        onListScroll?.();

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
      {/* Show subtle loading overlay when filtering existing items */}
      {isLoading && items.length > 0 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/35 backdrop-blur-[2px]">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <div className={`space-y-6 md:space-y-8 ${isLoading ? 'opacity-50' : ''}`}>
        {sortedCategories.map(category => (
          <section key={category.value}>
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <h2 className="font-public text-lg font-semibold tracking-[-0.03em] text-white">{category.label}</h2>
              <span className="ff-auth-chip text-xs">
                {category.items.length}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
              {category.items.map(item => (
                <InventoryCard
                  key={item.id}
                  item={item}
                  onOpen={onOpenItem}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
