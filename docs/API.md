# 🌌 COSMOS OS — API Reference

This document provides a comprehensive API reference for the Shared Core (`@cosmos/core`) and the platforms.

---

## 🎨 Theme Engine API

The Theme Engine manages 11 pre-configured themes using custom CSS variables dynamically injected on the root element.

### Context Options

```typescript
export interface Theme {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  themes: Theme[];
}
```

### Supported Themes

1. **Aether** (`aether`): Soft, Airy, Premium
2. **Lunar** (`lunar`): Dark Navy, Tight, Glow
3. **Aurora** (`aurora`): Gradient, Bold, Vibrant
4. **Forest** (`forest`): Organic, Rounded, Earthy
5. **Retro** (`retro`): Sharp, Monospace, Flat
6. **Cosmic** (`cosmic`): Dark + Neon, Pill Shapes, Glow
7. **Minimal** (`minimal`): Zero Decoration, System, Flat
8. **Nebula** (`nebula`): Purple + Pink + Deep Space
9. **Galaxy** (`galaxy`): Blue + Silver + Stars
10. **Studio Pro** (`studio-pro`): Dark + Green + Console
11. **Synthwave** (`synthwave`): Pink + Cyan + Neon

---

## 🛠️ Workspace Engine API

The Workspace Engine partitions data, preferences, and module states on a per-workspace basis.

### Usage

```typescript
import { useWorkspace } from '@cosmos/core';

const { workspace, setWorkspace } = useWorkspace();
```

### Storage Pattern

All state models use standard prefix isolation:
`cosmos:ws:{workspace_id}:{module_key}`

---

## 🤖 AI Engine API

COSMOS OS v5.0 features real integration with Google Gemini and Anthropic Claude APIs with full streaming and error retry handlers.

### Gemini API Integration

```typescript
import { geminiClient } from '@cosmos/core';

// 1. Un-streamed text generation
const response = await geminiClient.generate("What is a soul card?", "Use a calm, blunt tone.");

// 2. Streamed generation with callback
await geminiClient.stream("Summarize my current work board state", (chunk) => {
  console.log(chunk);
});
```

### Claude API Integration

```typescript
import { claudeClient } from '@cosmos/core';

// 1. Generation
const response = await claudeClient.generate("Analyze this budget structure", "You are Nami.");
```

---

## 🖥️ Layout Engine API

Configures bento grids, docks, sidebars, and tab layouts.

```typescript
export interface PanelConfig {
  id: string;
  visible: boolean;
  size?: number; // width/height percentage
}

export interface LayoutConfig {
  id: string;
  name: string;
  type: 'dock' | 'split' | 'tabs' | 'grid' | 'canvas';
  panels: PanelConfig[];
}
```
