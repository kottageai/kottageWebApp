export interface Address {
  id: number;
  line1: string;
  line2: string;
  city: string;
  zip: string;
  country: string;
  isHome: boolean;
  enabled: boolean;
  radius?: number;
}

const LOCATION_ADDRESSES_KEY = 'location_addresses';
const TRAVEL_ADDRESSES_KEY = 'travel_addresses';

export const saveAddresses = (locationAddresses: Address[], travelAddresses: Address[]) => {
  try {
    localStorage.setItem(LOCATION_ADDRESSES_KEY, JSON.stringify(locationAddresses));
    localStorage.setItem(TRAVEL_ADDRESSES_KEY, JSON.stringify(travelAddresses));
  } catch (error) {
    console.error("Failed to save addresses to localStorage", error);
  }
};

export const loadAddresses = (): { locationAddresses: Address[], travelAddresses: Address[] } => {
  try {
    const locationAddressesJson = localStorage.getItem(LOCATION_ADDRESSES_KEY);
    const travelAddressesJson = localStorage.getItem(TRAVEL_ADDRESSES_KEY);

    const locationAddresses = locationAddressesJson ? JSON.parse(locationAddressesJson) : [];
    const travelAddresses = travelAddressesJson ? JSON.parse(travelAddressesJson) : [];

    return { locationAddresses, travelAddresses };
  } catch (error) {
    console.error("Failed to load addresses from localStorage", error);
    return { locationAddresses: [], travelAddresses: [] };
  }
}; 