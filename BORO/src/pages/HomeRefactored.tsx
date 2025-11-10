import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Navbar from '../components/Navbar';
import Masonry from 'react-masonry-css';
import './Home2.css';
import { ACCENTS } from '../lib/accents';
import ActivityCard from '../components/ActivityCard.tsx';
import RecentActivityCard from '../components/RecentActivityCard';
import PeopleCard from '../components/PeopleCard';
import QuickAddCard from '../components/QuickAddCard';
import FilterPopover from '../components/shared/FilterPopover';
import SummaryCards from '../components/shared/SummaryCards';
import TopBar from '../components/shared/TopBar';
import { useAuth } from '../context/AuthContext';
import { getDaysLeft, getOverdueDays } from '../lib/date';
import { useFilters } from '../hooks/useFilters';
import { useActivityData } from '../hooks/useActivityData';
import { useFavorites } from '../hooks/useFavorites';

// Activity colors
const ACTIVITY_COLORS = {
  storage: ACCENTS.storage,
  borrowed: ACCENTS.borrowed,
  lent: ACCENTS.lent,
  favorite: ACCENTS.favorite,
};

export default function HomeRefactored() {
  const { user } = useAuth();
  const {
    // Search
    search,
    setSearch,
    
    // Filters
    typeFilters,
    modeFilters,
    favOnly,
    overdueOnly,
    dueSoonOnly,
    showPeople,
    filterAnchor,
    setFilterAnchor,
    
    // Computed
    hasActiveFilters,
    
    // Actions
    resetFilters,
    toggleType,
    toggleMode,
    setShowPeople,
    setFavOnly,
    setOverdueOnly,
    setDueSoonOnly,
  } = useFilters();
  
  const {
    activities,
    counts,
    recentEvents,
    favOwners,
    latestFavAt,
    favItemIds,
    setFavItemIds,
  } = useActivityData();
  
  const { toggleFavorite } = useFavorites();

  // Derived filtered list
  const filteredActivities = useMemo(() => {
    const term = search.trim().toLowerCase();
    return activities.filter((a) => {
      // type - if no type filters, show all types
      if (typeFilters.size > 0 && !typeFilters.has(a.activityType)) return false;
      // favorites
      if (favOnly && !favItemIds.has(a.id)) return false;
      // modes
      if (modeFilters.size > 0 && a.activityType === 'storage') {
        if (!a.borrowMode || !modeFilters.has(a.borrowMode)) return false;
      }
      if (modeFilters.size > 0 && (a.activityType === 'borrowed' || a.activityType === 'lent')) {
        if (!a.borrowMode || !modeFilters.has(a.borrowMode)) return false;
      }
      // due filters only apply to borrowed/lent
      if (overdueOnly || dueSoonOnly) {
        if (!(a.borrowedUntil && (a.activityType === 'borrowed' || a.activityType === 'lent')))
          return false;
        const overdue = getOverdueDays(a.borrowedUntil as any) > 0;
        const daysLeft = getDaysLeft(a.borrowedUntil as any);
        const soon = daysLeft > 0 && daysLeft <= 3;
        const passOverdue = overdueOnly ? overdue : false;
        const passSoon = dueSoonOnly ? soon : false;
        if (overdueOnly && dueSoonOnly) {
          if (!(overdue || soon)) return false;
        } else if (overdueOnly) {
          if (!passOverdue) return false;
        } else if (dueSoonOnly) {
          if (!passSoon) return false;
        }
      }
      if (!term) return true;
      const hay = [
        a.title,
        a.category,
        a.location,
        (a as any).note,
        (a as any).description,
        (a as any).ownerName,
        (a as any).holderName,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(term);
    });
  }, [activities, search, typeFilters, modeFilters, favOnly, overdueOnly, dueSoonOnly, favItemIds]);

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: '100vh',
          // Base color adjusted to reference (#0f1115) instead of ui.bg
          background: `radial-gradient(900px 600px at 10% -10%, rgba(139,227,106,.08), transparent 40%), radial-gradient(800px 500px at 110% 40%, rgba(123,220,255,.06), transparent 40%), #0f1115`,
          py: 4,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 1400,
            mx: 'auto',
            px: { xs: 2, sm: 3 },
          }}
        >
          <TopBar
            search={search}
            onSearchChange={setSearch}
            hasActiveFilters={hasActiveFilters}
            onFilterClick={(e) => setFilterAnchor(e.currentTarget)}
            onResetFilters={resetFilters}
          />
          
          <FilterPopover
            filterAnchor={filterAnchor}
            onClose={() => setFilterAnchor(null)}
            typeFilters={typeFilters}
            modeFilters={modeFilters}
            favOnly={favOnly}
            overdueOnly={overdueOnly}
            dueSoonOnly={dueSoonOnly}
            showPeople={showPeople}
            onToggleType={toggleType}
            onToggleMode={toggleMode}
            onToggleFavOnly={() => setFavOnly(v => !v)}
            onToggleOverdueOnly={() => setOverdueOnly(v => !v)}
            onToggleDueSoonOnly={() => setDueSoonOnly(v => !v)}
            onToggleShowPeople={() => setShowPeople(v => !v)}
          />

          <SummaryCards 
            storage={counts.storage} 
            borrowed={counts.borrowed} 
            lent={counts.lent} 
          />

          {/* Masonry Activity Feed */}
          {activities.length > 0 ? (
            (() => {
              // Build a render list with RecentActivityCard then optional PeopleCard
              const list: React.ReactNode[] = [];
              // Quick Add card always first
              list.push(<QuickAddCard key='quick-add' />);
              
              const items = filteredActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  item={activity}
                  type={activity.activityType}
                  accentColor={ACTIVITY_COLORS[activity.activityType]}
                  isFavorite={favItemIds.has(activity.id)}
                  onToggleFavorite={() => toggleFavorite(activity.id, favItemIds, setFavItemIds)}
                />
              ));
              
              // Insert RecentActivityCard first always
              list.push(
                <RecentActivityCard
                  key='recent-activity'
                  events={recentEvents.slice(0, 6)}
                />
              );
              
              // If we have favorite owners, always prepare the PeopleCard.
              // If the People filter is active, show only the PeopleCard (hiding other activity cards).
              if (favOwners.length > 0) {
                const people = (
                  <PeopleCard key='people-card' owners={favOwners} />
                );
                // If filter toggled to show people, hide other items and show only PeopleCard
                if (showPeople) {
                  list.push(people);
                } else {
                  // Otherwise, insert PeopleCard among the items (either first after RecentActivityCard or as 3rd card)
                  const latestActivityTs = Math.max(
                    ...activities.map((a) => a.activityTimestamp)
                  );
                  if (latestFavAt && latestFavAt > latestActivityTs) {
                    list.push(people, ...items);
                  } else {
                    const idx = Math.min(2, items.length);
                    list.push(...items.slice(0, idx), people, ...items.slice(idx));
                  }
                }
              } else {
                list.push(...items);
              }
            
              return (
                <Masonry
                  breakpointCols={{
                    default: 4,
                    1400: 3,
                    1024: 2,
                    640: 1,
                  }}
                  className='my-masonry-grid'
                  columnClassName='my-masonry-grid_column'
                >
                  {list}
                </Masonry>
              );
            })()
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant='body2' color='text.secondary'>
                {user
                  ? 'No activity yet. Add your first item to get started!'
                  : 'Sign in to see your activity'}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}