import { RawFacility, Facility } from "../types/facility.types";
import { transformFacility } from "../utils/facilityHelpers";
import { strings } from "../constants/strings";

/**
 * Loads facilities data from the JSON file
 * @returns Promise that resolves to an array of Facility objects
 * @throws Error if data cannot be loaded or is invalid
 */
export async function loadFacilities(): Promise<Facility[]> {
  const rawFacilities: RawFacility[] = require("../../assets/facilities.json");

  if (!rawFacilities || rawFacilities.length === 0) {
    throw new Error(strings.error.invalidData);
  }

  return rawFacilities.map(transformFacility);
}
