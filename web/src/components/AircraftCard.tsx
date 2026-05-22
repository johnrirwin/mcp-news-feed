import type { Aircraft } from '../aircraftTypes';
import { AIRCRAFT_TYPES } from '../aircraftTypes';
import { getAircraftImageUrl } from '../aircraftApi';

interface AircraftCardProps {
  aircraft: Aircraft;
  onSelect: (aircraft: Aircraft) => void;
  onEdit: (aircraft: Aircraft) => void;
  onDelete: (aircraft: Aircraft) => void;
}

export function AircraftCard({ aircraft, onSelect, onEdit, onDelete }: AircraftCardProps) {
  const aircraftType = AIRCRAFT_TYPES.find(t => t.value === aircraft.type);

  return (
    <div 
      className="ff-auth-card ff-auth-card-hover cursor-pointer rounded-[24px] p-4"
      onClick={() => onSelect(aircraft)}
    >
      <div className="flex gap-4">
        {/* Image */}
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-[18px] border border-white/10 bg-black/12">
          {aircraft.hasImage ? (
            <img
              src={getAircraftImageUrl(aircraft.id)}
              alt={aircraft.name}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl">
              {aircraftType?.icon || '🚁'}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="ff-auth-chip text-[11px]">
                {aircraftType?.label || aircraft.type}
              </span>
            </div>
            {/* Actions - stop propagation so clicking doesn't select */}
            <div 
              className="flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onEdit(aircraft)}
                className="rounded-xl p-1.5 text-slate-300/72 transition-colors hover:bg-white/10 hover:text-white"
                title="Edit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(aircraft)}
                className="rounded-xl p-1.5 text-slate-300/72 transition-colors hover:bg-white/10 hover:text-red-300"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Title */}
          <h3 className="mb-1 font-public text-lg font-semibold tracking-[-0.03em] text-white">
            {aircraft.name}
          </h3>

          {/* Nickname */}
          {aircraft.nickname && (
            <p className="mb-1 text-sm text-primary-300">
              "{aircraft.nickname}"
            </p>
          )}

          {/* Description */}
          {aircraft.description && (
            <p className="line-clamp-2 text-sm text-slate-300/64">
              {aircraft.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
