// packages/web/src/components/settings/SoundSettings.tsx
import { useSound } from '@/hooks/useSound';
import { Toggle } from '@/components/ui/Toggle';

export function SoundSettings() {
  const { isEnabled, toggle } = useSound();

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
      <div>
        <h4 className="text-sm font-medium text-white/90">Sound Effects</h4>
        <p className="text-xs text-white/40">Enable sound feedback for interactions</p>
      </div>
      <Toggle checked={isEnabled} onChange={toggle} />
    </div>
  );
}
