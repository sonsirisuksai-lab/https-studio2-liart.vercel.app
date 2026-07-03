export const typography = {
  heading1: {
    fontSize: '96px',
    fontWeight: '300',
    letterSpacing: '-0.02em',
  },
  heading2: {
    fontSize: '64px',
    fontWeight: '400',
    letterSpacing: '-0.02em',
  },
  heading3: {
    fontSize: '48px',
    fontWeight: '400',
    letterSpacing: '-0.015em',
  },
  body: {
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '1.6',
  },
  label: {
    fontSize: '12px',
    fontWeight: '500',
    letterSpacing: '0.04em',
  },
} as const;

export type TypographyToken = keyof typeof typography;
