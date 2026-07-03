import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface GlassCardProps extends ViewProps {
  children?: React.ReactNode;
}

export function GlassCard({ children, className, style, ...props }: GlassCardProps) {
  const { colors } = useTheme();

  return (
    <View
      className={`rounded-2xl p-4 border ${className || ''}`}
      style={[
        {
          backgroundColor: colors.glass,
          borderColor: colors.border,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
