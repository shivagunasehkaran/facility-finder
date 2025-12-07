/**
 * Application strings for better maintainability and future localization
 * Organized by feature/screen for easy navigation
 */

export const strings = {
  // Common/Loading
  loading: "Loading...",
  loadingFacilities: "Loading facilities...",

  // Error messages
  error: {
    generic: "Please try again later.",
    loadFacilities: "Failed to load facilities",
    invalidData: "Invalid facilities data format or empty array",
    checkDataFile: "Please check your data file and try again.",
    facilityNotFound: "Facility not found",
    facilityNotFoundSubtext: "The facility you're looking for doesn't exist.",
  },

  // Empty states
  empty: {
    noFacilities: "No facilities found",
    noFacilitiesSubtext: "Please check your data file.",
    noResults: "No results found",
    noResultsSubtext: "Try adjusting your search query.",
    noAmenities: "No amenities listed",
  },

  // Search
  search: {
    placeholder: "Search facilities...",
    placeholderDetailed: "Search by name, address, suburb...",
  },

  // Facility Details
  facilityDetails: {
    address: "Address",
    locationDetails: "Location Details",
    coordinates: "Coordinates",
    amenities: "Amenities",
  },

  // Context/Provider errors
  context: {
    providerError: "useFacilities must be used within a FacilitiesProvider",
  },
} as const;

// Type-safe string access
export type Strings = typeof strings;

