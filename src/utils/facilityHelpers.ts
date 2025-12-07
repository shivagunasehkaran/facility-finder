import { RawFacility, Facility } from '../types/facility.types';

/**
 * Parses address string to extract suburb, state, and postcode
 * Format: "Street Address, Suburb, State Postcode"
 * Example: "123 Market St, Sydney, NSW 2000"
 */
export function parseAddress(address: string): {
  suburb: string;
  state: string;
  postcode: string;
} {
  const parts = address.split(',').map((part) => part.trim());
  
  if (parts.length < 3) {
    // Fallback if format is unexpected
    return {
      suburb: parts[1] || '',
      state: '',
      postcode: '',
    };
  }

  const suburb = parts[1] || '';
  const statePostcode = parts[2] || '';
  
  // Extract state and postcode (format: "NSW 2000" or "VIC 3000")
  const statePostcodeMatch = statePostcode.match(/^([A-Z]{2,3})\s+(\d{4})$/);
  
  if (statePostcodeMatch) {
    return {
      suburb,
      state: statePostcodeMatch[1],
      postcode: statePostcodeMatch[2],
    };
  }

  // Fallback if regex doesn't match
  const spaceIndex = statePostcode.lastIndexOf(' ');
  if (spaceIndex > 0) {
    return {
      suburb,
      state: statePostcode.substring(0, spaceIndex),
      postcode: statePostcode.substring(spaceIndex + 1),
    };
  }

  return {
    suburb,
    state: statePostcode,
    postcode: '',
  };
}

/**
 * Transforms raw facility data to Facility interface
 */
export function transformFacility(rawFacility: RawFacility): Facility {
  const { suburb, state, postcode } = parseAddress(rawFacility.address);

  return {
    id: rawFacility.id,
    name: rawFacility.name,
    address: rawFacility.address,
    suburb,
    state,
    postcode,
    facilities: rawFacility.facilities,
    latitude: rawFacility.location.latitude,
    longitude: rawFacility.location.longitude,
  };
}

/**
 * Filters facilities based on search query
 * Searches in name, address, suburb, state, and postcode
 */
export function filterFacilities(
  facilities: Facility[],
  searchQuery: string
): Facility[] {
  if (!searchQuery.trim()) {
    return facilities;
  }

  const query = searchQuery.toLowerCase().trim();

  return facilities.filter((facility) => {
    const searchableText = [
      facility.name,
      facility.address,
      facility.suburb,
      facility.state,
      facility.postcode,
    ]
      .join(' ')
      .toLowerCase();

    return searchableText.includes(query);
  });
}

