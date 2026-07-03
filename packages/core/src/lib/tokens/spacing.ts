export const spacing = {
  space1: '4px',
  space2: '8px',
  space3: '12px',
  space4: '16px',
  space5: '24px',
  space6: '32px',
  space7: '48px',
  space8: '64px',
} as const;

export type SpacingToken = keyof typeof spacing;
