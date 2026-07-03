import React from 'react';
import { Slot } from 'expo-router';
import { ThemeProvider, WorkspaceProvider } from '@cosmos/core';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <WorkspaceProvider>
          <Slot />
        </WorkspaceProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
