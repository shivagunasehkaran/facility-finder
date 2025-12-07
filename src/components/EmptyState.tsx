import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, fontSize } from "../constants/theme";

interface EmptyStateProps {
  message: string;
  subtext?: string;
}

export function EmptyState({ message, subtext }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      {subtext && <Text style={styles.subtext}>{subtext}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  text: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  subtext: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: "center",
  },
});

