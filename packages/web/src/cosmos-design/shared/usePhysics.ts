export function usePhysics() {
  const bouncySpring = { type: 'spring', stiffness: 300, damping: 10, mass: 1 };
  const heavySpring = { type: 'spring', stiffness: 100, damping: 20, mass: 2 };
  const fluidSpring = { type: 'spring', stiffness: 50, damping: 20, mass: 1 };

  return { bouncySpring, heavySpring, fluidSpring };
}
