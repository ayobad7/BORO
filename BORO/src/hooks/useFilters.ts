import { useState, useMemo } from 'react';
import type { BorrowMode } from '../types';

interface UseFiltersProps {
  onReset?: () => void;
}

export function useFilters({ onReset }: UseFiltersProps = {}) {
  const [search, setSearch] = useState('');
  const [typeFilters, setTypeFilters] = useState<Set<'storage' | 'borrowed' | 'lent'>>(new Set());
  const [modeFilters, setModeFilters] = useState<Set<BorrowMode>>(new Set());
  const [favOnly, setFavOnly] = useState(false);
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [dueSoonOnly, setDueSoonOnly] = useState(false);
  const [showPeople, setShowPeople] = useState(false);
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);

  const hasActiveFilters = useMemo(() => {
    return (
      typeFilters.size > 0 ||
      modeFilters.size > 0 ||
      favOnly ||
      overdueOnly ||
      dueSoonOnly ||
      showPeople ||
      search.length > 0
    );
  }, [typeFilters, modeFilters, favOnly, overdueOnly, dueSoonOnly, showPeople, search]);

  const resetFilters = () => {
    setSearch('');
    setTypeFilters(new Set());
    setModeFilters(new Set());
    setFavOnly(false);
    setOverdueOnly(false);
    setDueSoonOnly(false);
    setShowPeople(false);
    if (onReset) onReset();
  };

  const toggleType = (t: 'storage' | 'borrowed' | 'lent') => {
    setTypeFilters((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  const toggleMode = (m: BorrowMode) => {
    setModeFilters((prev) => {
      const next = new Set(prev);
      if (next.has(m)) next.delete(m);
      else next.add(m);
      return next;
    });
  };

  return {
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
  };
}