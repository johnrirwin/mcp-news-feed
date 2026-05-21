import { useState } from 'react';
import type { Aircraft } from '../aircraftTypes';
import { AircraftList } from './AircraftList';
import { MobileFloatingControls } from './MobileFloatingControls';

interface AircraftPageProps {
  aircraftItems: Aircraft[];
  isAircraftLoading: boolean;
  aircraftError: string | null;
  onSelectAircraft: (aircraft: Aircraft) => void;
  onEditAircraft: (aircraft: Aircraft) => void;
  onDeleteAircraft: (aircraft: Aircraft) => void;
  onAddAircraft: () => void;
}

export function AircraftPage({
  aircraftItems,
  isAircraftLoading,
  aircraftError,
  onSelectAircraft,
  onEditAircraft,
  onDeleteAircraft,
  onAddAircraft,
}: AircraftPageProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const controls = (
    <div className="ff-auth-toolbar">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="ff-auth-section-title">My Aircraft</h1>
          <p className="ff-auth-page-subtitle mt-2 text-sm">
            Manage your drones, components, and receiver settings
          </p>
        </div>
        <button
          onClick={() => {
            onAddAircraft();
            setIsMobileMenuOpen(false);
          }}
          className="ff-auth-cta-primary w-full gap-2 sm:w-auto"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Aircraft
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative flex-1 min-h-0 flex flex-col overflow-hidden">
      <div className="hidden md:block flex-shrink-0">{controls}</div>

      <AircraftList
        aircraft={aircraftItems}
        isLoading={isAircraftLoading}
        error={aircraftError}
        onSelect={onSelectAircraft}
        onEdit={onEditAircraft}
        onDelete={onDeleteAircraft}
        mobileTopInset
        onListScroll={() => setIsMobileMenuOpen((prev) => (prev ? false : prev))}
      />

      <MobileFloatingControls
        label="Aircraft Controls"
        isOpen={isMobileMenuOpen}
        onToggle={() => setIsMobileMenuOpen((prev) => !prev)}
      >
        {controls}
      </MobileFloatingControls>
    </div>
  );
}
