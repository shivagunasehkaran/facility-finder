import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { colors, spacing, borderRadius, fontSize } from "@/constants/theme";
import { useFacilities } from "@/context/FacilitiesContext";

export default function FacilityDetailsScreen() {
  const { facilityId } = useLocalSearchParams<{ facilityId: string }>();
  const { state } = useFacilities();

  // Find facility by ID
  const facility = state.allFacilities.find((f) => f.id === facilityId);

  if (!facility) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Facility not found</Text>
        </View>
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
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
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
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
  errorText: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.error,
    textAlign: "center",
  },
});
