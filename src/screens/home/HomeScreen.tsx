import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { FacilityListItem } from "@/components/FacilityListItem";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { colors, spacing } from "@/constants/theme";
import { strings } from "@/constants/strings";
import { useFacilitySearch } from "@/hooks/useFacilitySearch";
import { useFacilities } from "@/context/FacilitiesContext";
import { Facility } from "@/types/facility.types";
import { SearchBar } from "@/components/SearchBar";

export default function HomeScreen() {
  const router = useRouter();
  const { state, retry } = useFacilities();
  const { searchQuery, setSearchQuery } = useFacilitySearch();

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
      <FacilityListItem facility={item} onPress={handleFacilityPress} />
    ),
    [handleFacilityPress]
  );

  const keyExtractor = useCallback((item: Facility) => item.id, []);

  // FlashList performance optimization: estimatedItemSize helps with virtualization
  // Calculation: padding (32) + name (18) + margin (4) + address (39) + border (1) ≈ 94px
  // Using 90px as a conservative estimate for better scroll performance
  const estimatedItemSize = 90;

  if (state.isLoading) {
    return <LoadingState message={strings.loadingFacilities} />;
  }

  if (state.error) {
    return (
      <ErrorState
        message={state.error}
        subtext={strings.error.checkDataFile}
        onRetry={retry}
      />
    );
  }

  if (state.allFacilities.length === 0) {
    return (
      <EmptyState
        message={strings.empty.noFacilities}
        subtext={strings.empty.noFacilitiesSubtext}
      />
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={strings.search.placeholderDetailed}
      />
      {state.filteredFacilities.length === 0 ? (
        <EmptyState
          message={strings.empty.noResults}
          subtext={strings.empty.noResultsSubtext}
        />
      ) : (
        <FlashList
          data={state.filteredFacilities}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          // @ts-ignore - FlashList type definitions may be outdated, but this prop works at runtime
          estimatedItemSize={estimatedItemSize}
          estimatedListSize={{
            height: estimatedItemSize * state.filteredFacilities.length,
            width: 0, // Will be calculated by FlashList
          }}
          drawDistance={estimatedItemSize * 2} // Render 2 screen heights worth of items
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
});
