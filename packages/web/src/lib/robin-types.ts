export type RobinAction = 'idle' | 'thinking' | 'capturing' | 'celebrating' | 'sleeping' | 'pointing';
export type RobinEmotion = 'curious' | 'happy' | 'focused' | 'confused' | 'excited';

export interface RobinContextType {
  action: RobinAction;
  emotion: RobinEmotion;
  message: string | null;
  setAction: (action: RobinAction) => void;
  setEmotion: (emotion: RobinEmotion) => void;
  say: (text: string, duration?: number) => void;
  triggerThinking: (duration?: number) => void;
}
