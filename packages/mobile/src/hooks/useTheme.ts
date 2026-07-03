import { useTheme as useCoreTheme } from '@cosmos/core';
import { getMobileTheme, MobileThemeColors } from '../styles/theme';

export function useTheme() {
  const coreTheme = useCoreTheme();
  const colors = getMobileTheme(coreTheme.theme);
  return {
    ...coreTheme,
    colors,
  };
}
export type { MobileThemeColors };
