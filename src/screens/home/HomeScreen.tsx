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
  const { state } = useFacilities();
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
    return <LoadingState message={strings.loadingFacilities} />;
  }

  if (state.error) {
    return (
      <ErrorState message={state.error} subtext={strings.error.checkDataFile} />
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
});
