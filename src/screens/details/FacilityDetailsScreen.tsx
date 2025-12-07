import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing, borderRadius, fontSize } from "@/constants/theme";
import { useFacilityDetails } from "@/hooks/useFacilityDetails";
import { EmptyState } from "@/components/EmptyState";
import { DetailSection } from "@/components/DetailSection";

export default function FacilityDetailsScreen() {
  const facility = useFacilityDetails();

  if (!facility) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <EmptyState
          message="Facility not found"
          subtext="The facility you're looking for doesn't exist."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>{facility.name}</Text>

          <DetailSection title="Address" value={facility.address} />

          <DetailSection
            title="Location Details"
            value={`${facility.suburb}, ${facility.state} ${facility.postcode}`}
          />

          <DetailSection
            title="Coordinates"
            value={`${facility.latitude.toFixed(
              6
            )}, ${facility.longitude.toFixed(6)}`}
          />

          <DetailSection title="Amenities">
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
          </DetailSection>
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
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.lg,
  },
  sectionContent: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: fontSize.md * 1.5,
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
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
    fontWeight: "500",
  },
});
