import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, spacing, fontSize, borderRadius } from "../constants/theme";
import { strings } from "../constants/strings";

interface ErrorStateProps {
  message: string;
  subtext?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message,
  subtext = strings.error.generic,
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>Error: {message}</Text>
      <Text style={styles.subtext}>{subtext}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      )}
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
    marginBottom: spacing.md,
  },
  retryButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  retryButtonText: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.background,
  },
});
