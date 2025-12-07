import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Facility } from "../types/facility.types";
import { colors, spacing, fontSize, touchTarget } from "../constants/theme";

interface FacilityListItemProps {
  facility: Facility;
  onPress: () => void;
}

export const FacilityListItem = memo<FacilityListItemProps>(
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    minHeight: touchTarget.minHeight,
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  address: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: fontSize.sm * 1.4,
  },
});
