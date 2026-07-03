import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useWorkspace } from '@cosmos/core';
import { GlassCard } from '../components/GlassCard';
import { TabBar } from '../components/TabBar';

const REALMS = [
  { icon: '🏠', name: 'CORE' },
  { icon: '⚡', name: 'WORK' },
  { icon: '🧠', name: 'THINK' },
  { icon: '🎵', name: 'STUDIO' },
  { icon: '❤️', name: 'LIFE' },
  { icon: '💬', name: 'SIGNAL' },
  { icon: '💰', name: 'MONEY' },
];

export default function HomeScreen() {
  const { theme, colors, setTheme, themes } = useTheme();
  const { workspace, setWorkspace } = useWorkspace();

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="flex-1">
        <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 24 }}>
          {/* Header */}
          <View className="mb-6 flex-row justify-between items-center">
            <View>
              <Text className="text-3xl font-light tracking-widest" style={{ color: colors.text }}>
                COSMOS OS
              </Text>
              <Text className="text-xs uppercase tracking-wider mt-1" style={{ color: colors.textSecondary }}>
                Realm: {workspace.toUpperCase()}
              </Text>
            </View>
            <View
              className="px-3 py-1.5 rounded-full border"
              style={{
                backgroundColor: colors.glass,
                borderColor: colors.border,
              }}
            >
              <Text className="text-xs font-mono uppercase" style={{ color: colors.primary }}>
                {theme}
              </Text>
            </View>
          </View>

          {/* Banner GlassCard */}
          <GlassCard className="p-5 mb-6">
            <Text className="text-xl font-light tracking-wide mb-2" style={{ color: colors.text }}>
              Welcome to COSMOS Mobile
            </Text>
            <Text className="text-sm leading-5" style={{ color: colors.textSecondary }}>
              Your sovereign workspace, physical manifestations, and digital synthesis — now natively active on your mobile unit.
            </Text>
          </GlassCard>

          {/* Workspace switcher */}
          <Text className="text-xs font-semibold uppercase tracking-wider mb-3 pl-1" style={{ color: colors.textSecondary }}>
            Active Core Workspaces
          </Text>
          <View className="flex-row gap-2 mb-6">
            {['default', 'workspace-pro', 'cosmic-sandbox'].map((ws) => {
              const isCurrent = workspace === ws;
              return (
                <TouchableOpacity
                  key={ws}
                  onPress={() => setWorkspace(ws)}
                  className="px-4 py-2.5 rounded-xl border flex-1 items-center"
                  style={{
                    backgroundColor: isCurrent ? colors.primary : colors.glass,
                    borderColor: isCurrent ? colors.primary : colors.border,
                  }}
                >
                  <Text
                    className="text-xs font-bold capitalize"
                    style={{
                      color: isCurrent ? colors.background : colors.text,
                    }}
                  >
                    {ws.replace('-', ' ')}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 7 Realms Quick Access */}
          <Text className="text-xs font-semibold uppercase tracking-wider mb-3 pl-1" style={{ color: colors.textSecondary }}>
            Cosmic Realms Access
          </Text>
          <View className="flex-row flex-wrap gap-3 mb-6">
            {REALMS.map((realm) => (
              <TouchableOpacity
                key={realm.name}
                className="w-[72px] py-3 rounded-2xl items-center border"
                style={{
                  backgroundColor: colors.glass,
                  borderColor: colors.border,
                }}
              >
                <Text style={{ fontSize: 24, marginBottom: 4 }}>{realm.icon}</Text>
                <Text className="text-[10px] font-semibold tracking-wider" style={{ color: colors.text }}>
                  {realm.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* System status details */}
          <GlassCard className="p-4 flex-row justify-between items-center">
            <View>
              <Text className="text-xs font-mono uppercase" style={{ color: colors.textSecondary }}>
                Active Node: Live
              </Text>
              <Text className="text-lg font-light mt-1" style={{ color: colors.text }}>
                Vanguard Engine v5.0.0
              </Text>
            </View>
            <Text style={{ fontSize: 24 }}>✨</Text>
          </GlassCard>
        </ScrollView>
        <TabBar />
      </View>
    </SafeAreaView>
  );
}
