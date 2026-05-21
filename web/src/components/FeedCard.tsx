import type { FeedItem, SourceInfo } from '../types';
import { stripHtmlToText } from '../textUtils';

/**
 * Props for the FeedCard component
 */
interface FeedCardProps {
  /** The feed item to display */
  item: FeedItem;
  /** Optional source information for the feed */
  source?: SourceInfo;
  /** Callback when the card is clicked */
  onClick: () => void;
}

export function FeedCard({ item, source, onClick }: FeedCardProps) {
  const publishedAt = item.publishedAt ? new Date(item.publishedAt) : null;
  const timeAgo = publishedAt ? formatTimeAgo(publishedAt) : null;
  const summaryText = stripHtmlToText(item.summary);

  return (
    <article
      onClick={onClick}
      className="ff-auth-card ff-auth-card-hover cursor-pointer rounded-[24px] p-4 group"
    >
      <div className="flex gap-4">
        {/* Image */}
        {item.media?.imageUrl && (
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-[18px] border border-white/10 bg-black/12">
            <img
              src={item.media.imageUrl}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              onError={e => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  item.sourceType === 'youtube'
                    ? 'bg-red-500/16 text-red-300'
                    : item.sourceType === 'rss'
                    ? 'bg-blue-500/16 text-blue-300'
                    : 'bg-emerald-500/16 text-emerald-300'
                }`}
              >
                {source?.name || item.source}
              </span>
              {item.author && (
                <span className="text-xs text-slate-500">by {item.author}</span>
              )}
            </div>
            {item.score !== undefined && item.score !== null && (
              <div className="flex items-center gap-1 text-orange-400 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span className="font-medium">{item.score}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="mb-2 line-clamp-2 font-public text-[1.1rem] font-semibold tracking-[-0.03em] text-white transition-colors group-hover:text-primary-200">
            {item.title}
          </h3>

          {/* Summary */}
          {summaryText && (
            <p className="mb-3 line-clamp-2 text-sm text-slate-300/74">
              {summaryText}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between gap-2">
            {/* Tags */}
            {item.tags.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap">
                {item.tags.slice(0, 4).map(tag => (
                  <span
                    key={tag}
                    className="ff-auth-chip text-[11px]"
                  >
                    {tag}
                  </span>
                ))}
                {item.tags.length > 4 && (
                  <span className="text-xs text-slate-500">
                    +{item.tags.length - 4}
                  </span>
                )}
              </div>
            )}

            {/* Time */}
            {timeAgo && (
              <span className="text-xs text-slate-500 flex-shrink-0" title={publishedAt?.toLocaleString()}>
                {timeAgo}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return date.toLocaleDateString();
}
