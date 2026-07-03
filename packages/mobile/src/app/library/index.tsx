import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { GlassCard } from '../../components/GlassCard';
import { TabBar } from '../../components/TabBar';

const LIBRARY_ITEMS = [
  { id: '1', title: 'The Sovereign Mindset', type: 'Philosophical Text', icon: '📖' },
  { id: '2', title: 'AETHER Blueprint v4', type: 'Design Specs', icon: '📐' },
  { id: '3', title: 'Cosmic Cookbook #12', type: 'Gourmet Recipes', icon: '🍳' },
  { id: '4', title: 'Cassette Tape #041 Archive', type: 'Audio Synthesis', icon: '📼' },
];

export default function LibraryScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="flex-1">
        <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 24 }}>
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-light tracking-widest" style={{ color: colors.text }}>
              LIBRARY
            </Text>
            <Text className="text-xs uppercase tracking-wider mt-1" style={{ color: colors.textSecondary }}>
              Artifacts, Blueprints & Bookshelves
            </Text>
          </View>

          {/* Search bar mock */}
          <GlassCard className="p-3 mb-6 flex-row justify-between items-center">
            <Text className="text-sm font-light italic" style={{ color: colors.textSecondary }}>
              Search archives...
            </Text>
            <Text style={{ fontSize: 16 }}>🔍</Text>
          </GlassCard>

          {/* Content List */}
          <Text className="text-xs font-semibold uppercase tracking-wider mb-3 pl-1" style={{ color: colors.textSecondary }}>
            Stored Media & Blueprints
          </Text>
          <View className="gap-3 mb-6">
            {LIBRARY_ITEMS.map((item) => (
              <GlassCard key={item.id} className="p-4 flex-row items-center">
                <View className="w-12 h-12 rounded-xl bg-black/20 border border-white/5 items-center justify-center mr-4">
                  <Text style={{ fontSize: 22 }}>{item.icon}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium" style={{ color: colors.text }}>
                    {item.title}
                  </Text>
                  <Text className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                    {item.type}
                  </Text>
                </View>
                <TouchableOpacity
                  className="px-3 py-1.5 rounded-lg border"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.glass,
                  }}
                >
                  <Text className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.primary }}>
                    OPEN
                  </Text>
                </TouchableOpacity>
              </GlassCard>
            ))}
          </View>

          {/* Stored Stats */}
          <GlassCard className="p-4 border-dashed" style={{ borderColor: colors.border }}>
            <Text className="text-xs font-semibold uppercase mb-1" style={{ color: colors.text }}>
              Library Synchronization
            </Text>
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              Cloud Core Sync status: Active (4 artifacts fully local)
            </Text>
          </GlassCard>
        </ScrollView>
        <TabBar />
      </View>
    </SafeAreaView>
  );
}
