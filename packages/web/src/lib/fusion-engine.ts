// packages/web/src/lib/fusion-engine.ts

export interface FusionRecipe {
  id: string;
  name: string;
  icon: string;
  description: string;
  ingredients: string[]; // Object types
  result: {
    title: string;
    icon: string;
    description: string;
    action: string;
  };
}

export const FUSION_RECIPES: FusionRecipe[] = [
  {
    id: 'vinyl-prompt',
    name: 'AI Music Analysis',
    icon: '🎵✨',
    description: 'AI analyzes the vinyl and generates a new track based on your prompt',
    ingredients: ['vinyl', 'prompt'],
    result: {
      title: 'AI Music Analysis',
      icon: '🎵✨',
      description: 'AI analyzed the vinyl and created a new track. Check the studio!',
      action: 'Open Studio',
    },
  },
  {
    id: 'card-document',
    name: 'AI Summary',
    icon: '🃏📄',
    description: 'AI reviews the document and creates a concise summary',
    ingredients: ['soulcard', 'printer'],
    result: {
      title: 'AI Summary',
      icon: '📄✨',
      description: 'Document summarized with key action items. Ready to share!',
      action: 'View Summary',
    },
  },
  {
    id: 'dna-music',
    name: 'Personalized Playlist',
    icon: '🧬🎵',
    description: 'AI creates a playlist based on your DNA (age, habits, music taste)',
    ingredients: ['dna', 'vinyl'],
    result: {
      title: 'Personalized Playlist',
      icon: '🎵🧬',
      description: '12 songs generated just for you based on your DNA profile.',
      action: 'Listen Now',
    },
  },
  {
    id: 'book-prompt',
    name: 'Recipe Generator',
    icon: '📖✨',
    description: 'AI combines cookbook with your prompt to create a new recipe',
    ingredients: ['book', 'prompt'],
    result: {
      title: 'New Recipe Created',
      icon: '🍳✨',
      description: 'AI generated a unique recipe just for you. Try it in the kitchen!',
      action: 'View Recipe',
    },
  },
  {
    id: 'blueprint-code',
    name: 'Project Generator',
    icon: '📐💻',
    description: 'AI combines blueprint with code to auto-generate a project',
    ingredients: ['blueprint', 'code'],
    result: {
      title: 'Project Generated',
      icon: '🚀✨',
      description: 'AI created a full project structure from your blueprint and code.',
      action: 'Open Project',
    },
  },
  {
    id: 'brain-notes',
    name: 'Mind Map',
    icon: '🧠📝',
    description: 'AI creates a mind map from your brain connections and notes',
    ingredients: ['brain', 'notebook'],
    result: {
      title: 'Mind Map Created',
      icon: '🧠📊',
      description: 'AI connected your knowledge and notes into a visual mind map.',
      action: 'View Mind Map',
    },
  },
];

export function findFusion(types: string[]): FusionRecipe | null {
  const sorted = [...types].sort();
  for (const recipe of FUSION_RECIPES) {
    const ingredients = [...recipe.ingredients].sort();
    if (ingredients.length === sorted.length && ingredients.every((v, i) => v === sorted[i])) {
      return recipe;
    }
  }
  return null;
}
