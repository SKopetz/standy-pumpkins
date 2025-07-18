import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendar } from '../../hooks/useCalendar';
import { useEventDetails } from '../../hooks/useEventDetails';
import { useKioskContext } from '../../contexts/KioskContext';
import { useAuthContext } from '../../contexts/AuthContext';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { CategoryFilter } from './CategoryFilter';
import { EventDetails } from './EventDetails';
import { MobileCalendarView } from './MobileCalendarView';
import { InfoBanner } from '../ui/InfoBanner';

export function VolunteerCalendar() {
  const {
    dateRangeHeader,
    categories,
    selectedCategories,
    toggleCategory,
    previousWeek,
    nextWeek,
    calendarDays,
    isLoading,
    isAdmin
  } = useCalendar();

  const { isKioskMode } = useKioskContext();
  const { profile } = useAuthContext();

  const {
    selectedEvent,
    isMobile,
    showEventDetails,
    closeEventDetails
  } = useEventDetails();

  // Reference to the sign in button
  const signInButtonRef = React.useRef<HTMLButtonElement>(null);

  const handleSignInRequired = () => {
    signInButtonRef.current?.click();
  };

  if (isLoading) {
    return <div className="animate-pulse h-96 bg-light-hover rounded-lg"></div>;
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        {isAdmin && !isKioskMode && (
          <div className="mb-6">
            <CategoryFilter
              categories={categories}
              selectedCategories={selectedCategories}
              onToggle={toggleCategory}
            />
          </div>
        )}

        {!isKioskMode && (
          <InfoBanner message="Select an available patch shift below to volunteer." />
        )}

        <div className="mt-6">
          {isMobile ? (
            <MobileCalendarView
              days={calendarDays}
              onEventClick={showEventDetails}
              onSignInRequired={handleSignInRequired}
              onPrevious={previousWeek}
              onNext={nextWeek}
            />
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-dark">
                  {dateRangeHeader}
                </h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={previousWeek}
                    className="p-2 text-dark/60 hover:text-dark rounded-full hover:bg-light transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextWeek}
                    className="p-2 text-dark/60 hover:text-dark rounded-full hover:bg-light transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <CalendarHeader />
              <CalendarGrid 
                days={calendarDays} 
                onEventClick={showEventDetails}
                onSignInRequired={handleSignInRequired} 
              />
            </>
          )}
        </div>
      </div>

      {selectedEvent && profile && (
        <EventDetails
          event={selectedEvent}
          onClose={closeEventDetails}
          isModal={!isMobile}
        />
      )}

      {/* Hidden button for auth trigger */}
      <button
        ref={signInButtonRef}
        onClick={() => document.querySelector<HTMLButtonElement>('[data-signin-button="true"]')?.click()}
        className="hidden"
      />
    </>
  );
}