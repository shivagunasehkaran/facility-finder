/**
 * Raw facility data structure from facilities.json
 */
export interface RawFacility {
  id: string;
  name: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  facilities: string[];
}

/**
 * Processed Facility interface matching requirements
 */
export interface Facility {
  id: string;
  name: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  facilities: string[];
  latitude: number;
  longitude: number;
}

