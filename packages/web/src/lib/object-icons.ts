// packages/web/src/lib/object-icons.ts
import { IconName } from '@/components/ui/Icon';

export const OBJECT_ICONS: Record<string, IconName> = {
  vinyl: 'Music',
  book: 'BookOpen',
  soulCard: 'IdCard',
  dna: 'Dna',
  cassette: 'Podcast',
  polaroid: 'Image',
  vhs: 'Film',
  blueprint: 'Ruler',
  digitalFactory: 'Cpu',
  printer: 'Printer',
  typewriter: 'Type',
  notebook: 'Notebook',
} as const;

export type ObjectType = keyof typeof OBJECT_ICONS;
