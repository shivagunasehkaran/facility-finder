import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { FacilityListItem } from "@/components/FacilityListItem";
import { colors, spacing, fontSize } from "@/constants/theme";
import { useDebounce } from "@/hooks/useDebounce";
import { useFacilities } from "@/context/FacilitiesContext";
import { Facility } from "@/types/facility.types";
import { SearchBar } from "@/components/SearchBar";

export default function HomeScreen() {
  const router = useRouter();
  const { state, dispatch } = useFacilities();
  const [searchQuery, setSearchQuery] = useState(state.searchQuery);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Update context when debounced query changes
  useEffect(() => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: debouncedSearchQuery });
  }, [debouncedSearchQuery, dispatch]);

  const handleFacilityPress = useCallback(
    (facility: Facility) => {
      router.push({
        pathname: "/facility/details",
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
        <Text style={styles.emptySubtext}>Please check your data file.</Text>
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.error,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  errorSubtext: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: "center",
  },
  emptyText: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
