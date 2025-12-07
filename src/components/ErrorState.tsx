import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, fontSize } from "../constants/theme";
import { strings } from "../constants/strings";

interface ErrorStateProps {
  message: string;
  subtext?: string;
}

export function ErrorState({
  message,
  subtext = strings.error.generic,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>Error: {message}</Text>
      <Text style={styles.subtext}>{subtext}</Text>
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
  errorText: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.error,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  subtext: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
