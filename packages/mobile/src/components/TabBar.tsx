import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '../hooks/useTheme';

const TABS = [
  { name: 'Home', icon: '🏠', path: '/' },
  { name: 'Studio', icon: '🎵', path: '/studio' },
  { name: 'Library', icon: '📚', path: '/library' },
  { name: 'Settings', icon: '⚙️', path: '/settings' },
];

export function TabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { colors } = useTheme();

  return (
    <View
      className="flex-row items-center justify-around py-3 border-t"
      style={{
        backgroundColor: colors.glass,
        borderTopColor: colors.border,
      }}
    >
      {TABS.map((tab) => {
        // Match exact or parent paths
        const isActive = pathname === tab.path || (tab.path !== '/' && pathname.startsWith(tab.path));
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => router.push(tab.path as any)}
            className="items-center justify-center flex-1"
            activeOpacity={0.7}
          >
            <Text
              style={{
                fontSize: 22,
                opacity: isActive ? 1 : 0.4,
              }}
            >
              {tab.icon}
            </Text>
            <Text
              className="text-[10px] mt-0.5 font-medium"
              style={{
                color: isActive ? colors.primary : colors.textSecondary,
              }}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
