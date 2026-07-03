import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { GlassCard } from '../../components/GlassCard';
import { TabBar } from '../../components/TabBar';

export default function StudioScreen() {
  const { colors } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="flex-1">
        <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 24 }}>
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-light tracking-widest" style={{ color: colors.text }}>
              STUDIO
            </Text>
            <Text className="text-xs uppercase tracking-wider mt-1" style={{ color: colors.textSecondary }}>
              Soundwaves & Synthesis Engine
            </Text>
          </View>

          {/* Player Graphic */}
          <GlassCard className="p-6 mb-6 items-center border-2" style={{ borderColor: colors.primary }}>
            {/* Spinning Indicator */}
            <View
              className="w-48 h-48 rounded-full items-center justify-center border-4 mb-6"
              style={{
                borderColor: isPlaying ? colors.primary : colors.border,
                backgroundColor: 'rgba(0,0,0,0.3)',
              }}
            >
              <View
                className="w-16 h-16 rounded-full border-2"
                style={{
                  borderColor: colors.text,
                  backgroundColor: colors.background,
                }}
              />
            </View>

            <Text className="text-lg font-medium text-center" style={{ color: colors.text }}>
              Sovereign Audio Wave v2.0
            </Text>
            <Text className="text-xs mt-1 text-center" style={{ color: colors.textSecondary }}>
              Synth Engine: Sine Wave Osc.
            </Text>

            {/* Play Button */}
            <TouchableOpacity
              onPress={() => setIsPlaying(!isPlaying)}
              className="mt-6 px-8 py-3 rounded-full border"
              style={{
                backgroundColor: isPlaying ? colors.primary : 'transparent',
                borderColor: colors.primary,
              }}
            >
              <Text
                className="font-bold text-sm tracking-wider uppercase"
                style={{
                  color: isPlaying ? colors.background : colors.text,
                }}
              >
                {isPlaying ? '⏸ PAUSE FREQ' : '▶ ACTIVATE FREQ'}
              </Text>
            </TouchableOpacity>
          </GlassCard>

          {/* Sound Presets */}
          <Text className="text-xs font-semibold uppercase tracking-wider mb-3 pl-1" style={{ color: colors.textSecondary }}>
            Frequency Presets
          </Text>
          <View className="flex-row gap-3 mb-6">
            {['Ambient', 'Focus Low', 'NEXUS Synth'].map((preset) => (
              <TouchableOpacity
                key={preset}
                className="flex-1 py-3 px-2 rounded-xl border items-center"
                style={{
                  backgroundColor: colors.glass,
                  borderColor: colors.border,
                }}
              >
                <Text className="text-xs font-semibold" style={{ color: colors.text }}>
                  {preset}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Vinyl & Cassette info */}
          <GlassCard className="p-4">
            <Text className="text-xs font-mono uppercase mb-2" style={{ color: colors.primary }}>
              Active Virtual Media
            </Text>
            <Text className="text-sm font-medium mb-1" style={{ color: colors.text }}>
              💽 COSMOS Tape #041
            </Text>
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              Custom generative soundboard designed to tune neurons.
            </Text>
          </GlassCard>
        </ScrollView>
        <TabBar />
      </View>
    </SafeAreaView>
  );
}
