import { useLocalSearchParams } from "expo-router";
import { useFacilities } from "../context/FacilitiesContext";
import { Facility } from "../types/facility.types";

/**
 * Custom hook to get facility details by ID from route params
 * @returns Facility object if found, null otherwise
 */
export function useFacilityDetails(): Facility | null {
  const { facilityId } = useLocalSearchParams<{ facilityId: string }>();
  const { state } = useFacilities();

  if (!facilityId) {
    return null;
  }

  const facility = state.allFacilities.find((f) => f.id === facilityId);
  return facility || null;
}
