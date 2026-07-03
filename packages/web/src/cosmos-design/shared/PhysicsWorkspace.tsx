import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { playMechanicalSound } from './MechanicalSound';
import { useMatrix } from './MatrixContext';

import { mulberry32 } from './prng';

export const PhysicsWorkspace: React.FC<{
  notes: { id: number, text: string, color: string, startX: number, startY: number }[];
  onIncinerate: () => void;
}> = ({ notes, onIncinerate }) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const { aiEnergy } = useMatrix();
  
  // Refs for direct DOM manipulation to avoid React re-renders on every frame
  const noteRefs = useRef<{ [id: number]: HTMLDivElement | null }>({});
  const bodiesRef = useRef<{ body: Matter.Body, id: number, color: string, text: string }[]>([]);
  const engineRef = useRef<Matter.Engine | null>(null);

  useEffect(() => {
    if (engineRef.current) {
      // 100 energy -> 0.5 gravity. 0 energy -> 2.5 gravity
      engineRef.current.world.gravity.y = 2.5 - (aiEnergy / 100) * 2.0;
    }
  }, [aiEnergy]);

  useEffect(() => {
    if (!sceneRef.current) return;

    const engine = Matter.Engine.create();
    engine.world.gravity.y = 2.5 - (aiEnergy / 100) * 2.0;
    engineRef.current = engine;

    const width = sceneRef.current.clientWidth;
    const height = sceneRef.current.clientHeight;

    // Boundaries
    const walls = [
      Matter.Bodies.rectangle(width / 2, -500, width * 2, 1000, { isStatic: true }), // top (extended)
      Matter.Bodies.rectangle(width / 2, height + 50, width, 100, { isStatic: true }), // bottom
      Matter.Bodies.rectangle(-50, height / 2, 100, height, { isStatic: true }), // left
      Matter.Bodies.rectangle(width + 50, height / 2, 100, height, { isStatic: true }), // right
      
      // Incinerator Zone (bottom right)
      Matter.Bodies.rectangle(width - 64, height - 80, 128, 160, { 
        isStatic: true, 
        isSensor: true,
        label: 'incinerator'
      })
    ];
    
    Matter.World.add(engine.world, walls);

    // Create Note Bodies
    const newBodies = notes.map(note => {
      const body = Matter.Bodies.rectangle(note.startX, note.startY, 200, 200, {
        restitution: 0.6, // Bouncy
        frictionAir: 0.05, // Fluid dynamics feel
        friction: 0.1,
        density: 0.005,
      });
      return { body, id: note.id, color: note.color, text: note.text };
    });

    bodiesRef.current = newBodies;
    Matter.World.add(engine.world, newBodies.map(b => b.body));

    // Collision Events for Incinerator & Bouncing
    Matter.Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        
        // Incinerator Logic
        if (bodyA.label === 'incinerator' || bodyB.label === 'incinerator') {
          const noteBody = bodyA.label === 'incinerator' ? bodyB : bodyA;
          const index = bodiesRef.current.findIndex(b => b.body === noteBody);
          if (index !== -1) {
             Matter.World.remove(engine.world, noteBody);
             
             // Hide DOM element
             const id = bodiesRef.current[index].id;
             if (noteRefs.current[id]) {
               noteRefs.current[id]!.style.display = 'none';
             }
             
             bodiesRef.current.splice(index, 1);
             onIncinerate();
          }
        } else if (!bodyA.isStatic && !bodyB.isStatic) {
          // Play thud on collision between notes
          if (pair.collision.depth > 1) {
            playMechanicalSound('paper');
          }
        }
      });
    });

    // Mouse interaction setup (invisible canvas for mouse constraints)
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: { width, height, background: 'transparent', wireframes: false }
    });
    
    // Hide the actual canvas, we just need it for the mouse constraint events
    render.canvas.style.opacity = '0';
    render.canvas.style.position = 'absolute';
    render.canvas.style.zIndex = '50';

    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    
    Matter.Events.on(mouseConstraint, 'startdrag', () => {
      playMechanicalSound('paper');
    });

    Matter.World.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    Matter.Runner.run(Matter.Runner.create(), engine);
    Matter.Render.run(render);

    // Sync loop: Update DOM directly via refs
    const syncBodies = () => {
      bodiesRef.current.forEach(b => {
        const el = noteRefs.current[b.id];
        if (el) {
          el.style.left = `${b.body.position.x}px`;
          el.style.top = `${b.body.position.y}px`;
          el.style.transform = `translate(-50%, -50%) rotate(${b.body.angle}rad)`;
        }
      });
      requestRef.current = requestAnimationFrame(syncBodies);
    };
    syncBodies();

    // Cleanup
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      Matter.Render.stop(render);
      Matter.Engine.clear(engine);
      if (render.canvas) render.canvas.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once

  return (
    <div ref={sceneRef} className="absolute inset-0 z-10 overflow-hidden pointer-events-auto">
      {notes.map(note => (
        <div
          key={note.id}
          ref={(el) => { noteRefs.current[note.id] = el; }}
          className={`absolute w-[200px] h-[200px] p-6 shadow-[0_10px_20px_rgba(0,0,0,0.1)] pointer-events-none text-stone-800 font-sans text-lg leading-relaxed ${note.color} flex flex-col`}
          style={{
            left: note.startX,
            top: note.startY,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Tape strip */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-6 bg-white/50 rotate-[-2deg] shadow-sm backdrop-blur-sm border border-white/20" />
          
          {/* Procedural Torn Edge (Pass 12 & 13) */}
          <ProceduralTornEdge seed={note.id} />
          
          <div className="relative z-10">{note.text}</div>
        </div>
      ))}
    </div>
  );
};

const ProceduralTornEdge = ({ seed }: { seed: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 200;
    canvas.height = 200;
    
    ctx.clearRect(0, 0, 200, 200);
    ctx.fillStyle = '#000'; // Using as a mask or just border decoration
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 1;
    
    const prng = mulberry32(seed * 99991); // offset seed for uniqueness

    // Draw procedural jagged bottom edge
    ctx.beginPath();
    ctx.moveTo(0, 190);
    for (let x = 0; x <= 200; x += 10) {
      const y = 190 + (prng() * 8 - 4); // Perlin-ish PRNG noise
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }, [seed]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-50" />;
};

