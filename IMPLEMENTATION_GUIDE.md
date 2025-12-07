# Facility Finder - Step-by-Step Implementation Guide

This guide will help you build the Facility Finder app from scratch, phase by phase.

---

## 📋 **PHASE 1: Project Setup & Dependencies**

### Step 1.1: Initialize Expo Project
```bash
npx create-expo-app facility-finder --template blank-typescript
cd facility-finder
```

### Step 1.2: Install Core Dependencies
```bash
npm install @react-navigation/native @react-navigation/stack
npm install @shopify/flash-list
npm install react-native-safe-area-context react-native-screens react-native-gesture-handler
npm install expo-router
npm install @expo/vector-icons
```

### Step 1.3: Install Dev Dependencies
```bash
npm install --save-dev babel-preset-expo typescript @types/react
```

### Step 1.4: Configure TypeScript
Create `tsconfig.json`:
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### Step 1.5: Configure Babel
Create `babel.config.js`:
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['expo-router/babel'],
  };
};
```

### Step 1.6: Update app.json
Add expo-router plugin:
```json
{
  "expo": {
    "plugins": ["expo-router"],
    "scheme": "facility-finder"
  }
}
```

### Step 1.7: Setup Entry Point
Create `index.ts`:
```typescript
import "expo-router/entry";
```

---

## 📋 **PHASE 2: Type Definitions**

### Step 2.1: Create Type Definitions Folder
```bash
mkdir -p src/types
```

### Step 2.2: Define Facility Types
Create `src/types/facility.types.ts`:
```typescript
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
```

### Step 2.3: JSON Module Declaration
Create `src/types/json.d.ts`:
```typescript
declare module '*.json' {
  const value: any;
  export default value;
}
```

---

## 📋 **PHASE 3: Constants & Theme**

### Step 3.1: Create Constants Folder
```bash
mkdir -p src/constants
```

### Step 3.2: Define Theme
Create `src/constants/theme.ts`:
```typescript
export const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  background: '#FFFFFF',
  surface: '#F2F2F7',
  text: '#000000',
  textSecondary: '#6D6D70',
  border: '#C6C6C8',
  error: '#FF3B30',
  success: '#34C759',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};

export const touchTarget = {
  minHeight: 44,
  minWidth: 44,
};
```

---

## 📋 **PHASE 4: Utility Functions**

### Step 4.1: Create Utils Folder
```bash
mkdir -p src/utils
```

### Step 4.2: Address Parser
Create `src/utils/facilityHelpers.ts`:
```typescript
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
```

---

## 📋 **PHASE 5: Data Layer (Separation of Concerns)**

### Step 5.1: Create Data Folder
```bash
mkdir -p src/data
```

### Step 5.2: Create Facilities Service
Create `src/data/facilitiesService.ts`:
```typescript
import { RawFacility, Facility } from '../types/facility.types';
import { transformFacility } from '../utils/facilityHelpers';

/**
 * Loads facilities data from the JSON file
 * @returns Promise that resolves to an array of Facility objects
 * @throws Error if data cannot be loaded or is invalid
 */
export async function loadFacilities(): Promise<Facility[]> {
  try {
    // Load facilities.json using require
    // Metro bundler handles JSON requires correctly in React Native
    const facilitiesModule = require('../../assets/facilities.json');
    
    // Handle both default export and direct array
    const rawFacilities: RawFacility[] = Array.isArray(facilitiesModule)
      ? facilitiesModule
      : Array.isArray(facilitiesModule?.default)
      ? facilitiesModule.default
      : [];

    if (!Array.isArray(rawFacilities) || rawFacilities.length === 0) {
      throw new Error('Invalid facilities data format or empty array');
    }

    // Transform raw facilities to Facility interface
    const facilities = rawFacilities.map(transformFacility);

    return facilities;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to load facilities';
    throw new Error(errorMessage);
  }
}
```

### Step 5.3: Add facilities.json
Copy your `facilities.json` to `assets/facilities.json`

---

## 📋 **PHASE 6: Custom Hooks**

### Step 6.1: Create Hooks Folder
```bash
mkdir -p src/hooks
```

### Step 6.2: Debounce Hook
Create `src/hooks/useDebounce.ts`:
```typescript
import { useState, useEffect } from 'react';

/**
 * Generic debounce hook
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

---

## 📋 **PHASE 7: State Management (Context + useReducer)**

### Step 7.1: Create Context Folder
```bash
mkdir -p src/context
```

### Step 7.2: Define State Interface
Create `src/context/FacilitiesContext.tsx`:
```typescript
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import { Facility } from '../types/facility.types';
import { filterFacilities } from '../utils/facilityHelpers';
import { loadFacilities } from '../data/facilitiesService';

// 1. Define State Interface
interface FacilitiesState {
  allFacilities: Facility[];
  filteredFacilities: Facility[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

// 2. Define Action Types
type FacilitiesAction =
  | { type: 'SET_FACILITIES'; payload: Facility[] }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// 3. Define Context Type
interface FacilitiesContextType {
  state: FacilitiesState;
  dispatch: React.Dispatch<FacilitiesAction>;
}

// 4. Initial State
const initialState: FacilitiesState = {
  allFacilities: [],
  filteredFacilities: [],
  searchQuery: '',
  isLoading: true,
  error: null,
};

// 5. Reducer Function
function facilitiesReducer(
  state: FacilitiesState,
  action: FacilitiesAction
): FacilitiesState {
  switch (action.type) {
    case 'SET_FACILITIES':
      return {
        ...state,
        allFacilities: action.payload,
        filteredFacilities: filterFacilities(action.payload, state.searchQuery),
        isLoading: false,
        error: null,
      };
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
        filteredFacilities: filterFacilities(state.allFacilities, action.payload),
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
}

// 6. Create Context
const FacilitiesContext = createContext<FacilitiesContextType | undefined>(
  undefined
);

// 7. Provider Component
interface FacilitiesProviderProps {
  children: ReactNode;
}

export function FacilitiesProvider({ children }: FacilitiesProviderProps) {
  const [state, dispatch] = useReducer(facilitiesReducer, initialState);

  useEffect(() => {
    async function fetchFacilities() {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        const facilities = await loadFacilities();
        dispatch({ type: 'SET_FACILITIES', payload: facilities });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to load facilities';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      }
    }

    fetchFacilities();
  }, []);

  return (
    <FacilitiesContext.Provider value={{ state, dispatch }}>
      {children}
    </FacilitiesContext.Provider>
  );
}

// 8. Custom Hook
export function useFacilitiesContext() {
  const context = useContext(FacilitiesContext);
  if (context === undefined) {
    throw new Error(
      'useFacilitiesContext must be used within a FacilitiesProvider'
    );
  }
  return context;
}
```

### Step 7.3: Create Convenience Hook
Create `src/hooks/useFacilities.ts`:
```typescript
import { useFacilitiesContext } from '../context/FacilitiesContext';

/**
 * Custom hook to consume FacilitiesContext
 * Throws error if used outside provider
 */
export function useFacilities() {
  return useFacilitiesContext();
}
```

---

## 📋 **PHASE 8: Components**

### Step 8.1: Create Components Folder
```bash
mkdir -p src/components
```

### Step 8.2: SearchBar Component
Create `src/components/SearchBar.tsx`:
```typescript
import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search facilities...',
}: SearchBarProps) {
  const handleClear = () => {
    onChangeText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          autoCapitalize="none"
          autoCorrect={false}
          {...(Platform.OS === 'ios' && { clearButtonMode: 'never' })}
        />
        {value.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.clearButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    height: 44,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text,
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
});
```

### Step 8.3: FacilityListItem Component
Create `src/components/FacilityListItem.tsx`:
```typescript
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Facility } from '../types/facility.types';
import { colors, spacing, fontSize, touchTarget } from '../constants/theme';

interface FacilityListItemProps {
  facility: Facility;
  onPress: () => void;
}

export const FacilityListItem = React.memo<FacilityListItemProps>(
  ({ facility, onPress }) => {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>
            {facility.name}
          </Text>
          <Text style={styles.address} numberOfLines={2}>
            {facility.address}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
);

FacilityListItem.displayName = 'FacilityListItem';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    minHeight: touchTarget.minHeight,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  address: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: fontSize.sm * 1.4,
  },
});
```

---

## 📋 **PHASE 9: Screens**

### Step 9.1: Create Screens Folder
```bash
mkdir -p src/screens/home
mkdir -p src/screens/details
```

### Step 9.2: Home Screen
Create `src/screens/home/HomeScreen.tsx`:
```typescript
import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { Facility } from '../../types/facility.types';
import { useFacilities } from '../../hooks/useFacilities';
import { useDebounce } from '../../hooks/useDebounce';
import { SearchBar } from '../../components/SearchBar';
import { FacilityListItem } from '../../components/FacilityListItem';
import { colors, spacing, fontSize } from '../../constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { state, dispatch } = useFacilities();
  const [searchQuery, setSearchQuery] = React.useState(state.searchQuery);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Update context when debounced query changes
  React.useEffect(() => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: debouncedSearchQuery });
  }, [debouncedSearchQuery, dispatch]);

  const handleFacilityPress = useCallback(
    (facility: Facility) => {
      router.push({
        pathname: '/facility/details',
        params: { facilityId: facility.id },
      });
    },
    [router]
  );

  const renderItem = useCallback(
    ({ item }: { item: Facility }) => (
      <FacilityListItem
        facility={item}
        onPress={() => handleFacilityPress(item)}
      />
    ),
    [handleFacilityPress]
  );

  const keyExtractor = useCallback((item: Facility) => item.id, []);

  const estimatedItemSize = 80;

  if (state.isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading facilities...</Text>
      </View>
    );
  }

  if (state.error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {state.error}</Text>
        <Text style={styles.errorSubtext}>
          Please check your data file and try again.
        </Text>
      </View>
    );
  }

  if (state.allFacilities.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No facilities found</Text>
        <Text style={styles.emptySubtext}>
          Please check your data file.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search by name, address, suburb..."
      />
      {state.filteredFacilities.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No results found</Text>
          <Text style={styles.emptySubtext}>
            Try adjusting your search query.
          </Text>
        </View>
      ) : (
        <FlashList
          data={state.filteredFacilities}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          estimatedItemSize={estimatedItemSize}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  errorSubtext: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
```

### Step 9.3: Details Screen
Create `src/screens/details/FacilityDetailsScreen.tsx`:
```typescript
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useFacilities } from '../../hooks/useFacilities';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';

export default function FacilityDetailsScreen() {
  const { facilityId } = useLocalSearchParams<{ facilityId: string }>();
  const { state } = useFacilities();

  // Find facility by ID
  const facility = state.allFacilities.find((f) => f.id === facilityId);

  if (!facility) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Facility not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>{facility.name}</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address</Text>
            <Text style={styles.sectionContent}>{facility.address}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location Details</Text>
            <Text style={styles.sectionContent}>
              {facility.suburb}, {facility.state} {facility.postcode}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Coordinates</Text>
            <Text style={styles.sectionContent}>
              {facility.latitude.toFixed(6)}, {facility.longitude.toFixed(6)}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            {facility.facilities.length > 0 ? (
              <View style={styles.amenitiesContainer}>
                {facility.facilities.map((amenity, index) => (
                  <View key={index} style={styles.amenityItem}>
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.sectionContent}>No amenities listed</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sectionContent: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: fontSize.md * 1.5,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.xs,
  },
  amenityItem: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  amenityText: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: '500',
  },
  errorText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.error,
    textAlign: 'center',
  },
});
```

---

## 📋 **PHASE 10: Navigation (Expo Router)**

### Step 10.1: Create App Routes
```bash
mkdir -p app
mkdir -p app/facility
```

### Step 10.2: Root Layout
Create `app/_layout.tsx`:
```typescript
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FacilitiesProvider } from "../src/context/FacilitiesContext";
import { colors, fontSize } from "../src/constants/theme";

function StackNavigator() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: fontSize.lg,
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Facility Finder",
        }}
      />
      <Stack.Screen
        name="facility/details"
        options={{
          title: "Facility Details",
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <FacilitiesProvider>
      <StatusBar style="auto" />
      <StackNavigator />
    </FacilitiesProvider>
  );
}
```

### Step 10.3: Home Route
Create `app/index.tsx`:
```typescript
import HomeScreen from "../src/screens/home/HomeScreen";

export default HomeScreen;
```

### Step 10.4: Details Route
Create `app/facility/details.tsx`:
```typescript
import FacilityDetailsScreen from "../../src/screens/details/FacilityDetailsScreen";

export default FacilityDetailsScreen;
```

---

## 📋 **PHASE 11: Testing & Verification**

### Step 11.1: Verify File Structure
```
facility-finder/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   └── facility/
│       └── details.tsx
├── assets/
│   └── facilities.json
├── src/
│   ├── components/
│   │   ├── FacilityListItem.tsx
│   │   └── SearchBar.tsx
│   ├── constants/
│   │   └── theme.ts
│   ├── context/
│   │   └── FacilitiesContext.tsx
│   ├── data/
│   │   └── facilitiesService.ts
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   └── useFacilities.ts
│   ├── screens/
│   │   ├── home/
│   │   │   └── HomeScreen.tsx
│   │   └── details/
│   │       └── FacilityDetailsScreen.tsx
│   ├── types/
│   │   ├── facility.types.ts
│   │   └── json.d.ts
│   └── utils/
│       └── facilityHelpers.ts
├── app.json
├── babel.config.js
├── index.ts
├── package.json
└── tsconfig.json
```

### Step 11.2: Run the App
```bash
npx expo start
```

### Step 11.3: Test Features
- ✅ App loads without errors
- ✅ Facilities list displays
- ✅ Search filters results (with 300ms debounce)
- ✅ Tapping facility navigates to details
- ✅ Details screen shows all facility information
- ✅ Loading states work
- ✅ Error states work
- ✅ Empty states work

---

## 🎯 **Key Concepts to Understand**

### 1. **Data Flow**
- JSON → `facilitiesService.ts` → `FacilitiesContext` → Components
- Transformation happens in `facilitiesService.ts`
- State management in Context

### 2. **State Management**
- `useReducer` for complex state
- Actions dispatched to update state
- State persists in Context (in-memory)

### 3. **Performance Optimizations**
- `FlashList` for large lists
- `useDebounce` for search
- `React.memo` for list items
- `useCallback` for stable functions

### 4. **Separation of Concerns**
- `data/` - Data fetching
- `context/` - State management
- `utils/` - Pure functions
- `components/` - Reusable UI
- `screens/` - Screen logic
- `app/` - Routing only

---

## 🚀 **Next Steps After Implementation**

1. Test on iOS and Android simulators
2. Verify all 100 facilities load correctly
3. Test search functionality
4. Test navigation flow
5. Check performance with FlashList
6. Verify error handling

Good luck with your implementation! 🎉

