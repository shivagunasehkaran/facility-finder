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
        // @ts-ignore - Valid prop but not in Expo Router types
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
