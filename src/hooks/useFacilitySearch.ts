import { useState, useEffect } from "react";
import { useDebounce } from "./useDebounce";
import { useFacilities } from "../context/FacilitiesContext";

/**
 * Custom hook to manage facility search functionality
 * Handles local search state, debouncing, and syncing with context
 * @param debounceDelay - Delay in milliseconds for debouncing (default: 300)
 * @returns Object containing searchQuery and setSearchQuery
 */
export function useFacilitySearch(debounceDelay: number = 300) {
  const { state, dispatch } = useFacilities();
  const [searchQuery, setSearchQuery] = useState(state.searchQuery);
  const debouncedSearchQuery = useDebounce(searchQuery, debounceDelay);

  // Update context when debounced query changes
  useEffect(() => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: debouncedSearchQuery });
  }, [debouncedSearchQuery, dispatch]);

  return {
    searchQuery,
    setSearchQuery,
  };
}
