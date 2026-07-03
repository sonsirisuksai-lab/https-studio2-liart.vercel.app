import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { GlassCard } from '../../components/GlassCard';
import { TabBar } from '../../components/TabBar';

export default function SettingsScreen() {
  const { theme, setTheme, themes, colors } = useTheme();

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="flex-1">
        <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 24 }}>
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-light tracking-widest" style={{ color: colors.text }}>
              SETTINGS
            </Text>
            <Text className="text-xs uppercase tracking-wider mt-1" style={{ color: colors.textSecondary }}>
              Configuration & Theme Core
            </Text>
          </View>

          {/* Theme Switcher section */}
          <Text className="text-xs font-semibold uppercase tracking-wider mb-3 pl-1" style={{ color: colors.textSecondary }}>
            Choose Core Theme (11 Options)
          </Text>

          <View className="gap-3 mb-6">
            {themes.map((t) => {
              const isSelected = t.id === theme;
              return (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => setTheme(t.id)}
                  activeOpacity={0.8}
                >
                  <GlassCard
                    className="p-4 flex-row items-center justify-between border"
                    style={{
                      borderColor: isSelected ? t.color : colors.border,
                      borderWidth: isSelected ? 2 : 1,
                    }}
                  >
                    <View className="flex-row items-center flex-1">
                      <View
                        className="w-10 h-10 rounded-xl items-center justify-center mr-4"
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.15)',
                        }}
                      >
                        <Text style={{ fontSize: 20 }}>{t.icon}</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-semibold" style={{ color: colors.text }}>
                          {t.name}
                        </Text>
                        <Text className="text-xs" style={{ color: colors.textSecondary }}>
                          {t.description}
                        </Text>
                      </View>
                    </View>

                    {/* Check or Dot indicator */}
                    <View className="flex-row items-center">
                      <View
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: t.color }}
                      />
                      {isSelected && (
                        <Text style={{ color: t.color, fontWeight: 'bold', fontSize: 16 }}>
                          ✓
                        </Text>
                      )}
                    </View>
                  </GlassCard>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* System metadata details */}
          <GlassCard className="p-4">
            <Text className="text-xs font-mono uppercase mb-2" style={{ color: colors.primary }}>
              System Integration
            </Text>
            <View className="flex-row justify-between mb-1">
              <Text className="text-xs" style={{ color: colors.textSecondary }}>
                Core Engine
              </Text>
              <Text className="text-xs font-mono" style={{ color: colors.text }}>
                @cosmos/core (Active)
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xs" style={{ color: colors.textSecondary }}>
                Client Platform
              </Text>
              <Text className="text-xs font-mono" style={{ color: colors.text }}>
                iOS & Android Expo (Native)
              </Text>
            </View>
          </GlassCard>
        </ScrollView>
        <TabBar />
      </View>
    </SafeAreaView>
  );
}
