import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Menu } from 'lucide-react';

export default function CreativeStudio() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f4f4] font-sans selection:bg-red-600 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference">
        <div className="text-xl font-bold tracking-tighter uppercase">King<br/>Studio</div>
        <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform">
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* Hero Section */}
      <section className="h-[120vh] relative flex flex-col justify-center items-center overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute z-0 w-full h-full flex items-center justify-center pointer-events-none"
          style={{ y: y1 }}
        >
          {/* Abstract 3D shape placeholder using gradients */}
          <div className="w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full bg-gradient-to-tr from-red-600/40 to-black blur-3xl mix-blend-screen" />
          <div className="absolute w-[60vw] h-[60vw] md:w-[30vw] md:h-[30vw] rounded-full bg-gradient-to-bl from-white/10 to-red-900/20 blur-2xl border border-white/5 backdrop-blur-3xl" />
        </motion.div>

        <div className="relative z-10 text-center px-4 w-full">
          <motion.h1 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[12vw] md:text-[8vw] font-black uppercase leading-[0.8] tracking-tighter"
          >
            Creative
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Studio</span>
          </motion.h1>
          
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 flex flex-col items-center gap-6"
          >
            <p className="max-w-md text-gray-400 text-lg md:text-xl font-light">
              We design digital experiences that elevate brands and build deep connections.
            </p>
            <button className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold uppercase tracking-wider transition-all flex items-center gap-2 group">
              Explore Work
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Marquee */}
      <div className="py-12 bg-red-600 text-white overflow-hidden flex whitespace-nowrap">
        <motion.div 
          animate={{ x: [0, -1035] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 10 }}
          className="text-6xl font-black uppercase tracking-tighter flex gap-8"
        >
          <span>DIGITAL DESIGN • </span>
          <span>BRAND IDENTITY • </span>
          <span>3D ANIMATION • </span>
          <span>WEB DEVELOPMENT • </span>
          <span>DIGITAL DESIGN • </span>
          <span>BRAND IDENTITY • </span>
        </motion.div>
      </div>

      {/* Selected Works */}
      <section className="py-32 px-6 md:px-20 relative z-10 bg-[#050505]">
        <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-20">Selected<br/>Works</h2>
        
        <div className="grid md:grid-cols-2 gap-10 md:gap-20">
          {[
            { id: 1, title: "Neon Cyber", category: "Web Design", offset: 0 },
            { id: 2, title: "Abstract Flow", category: "3D Animation", offset: 100 },
            { id: 3, title: "Dark Matter", category: "Brand Identity", offset: 0 },
            { id: 4, title: "Red Shift", category: "App Design", offset: 100 },
          ].map((work, i) => (
            <motion.div 
              key={work.id}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className={`group cursor-pointer ${i % 2 !== 0 ? 'md:mt-32' : ''}`}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm mb-6 bg-[#111]">
                {/* Image Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-32 h-32 bg-red-600 rounded-full blur-3xl mix-blend-screen" />
                </div>
                
                {/* Overlay Text */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/40">
                  <div className="flex justify-end">
                    <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                       <ArrowRight className="w-6 h-6 -rotate-45 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-3xl font-bold uppercase tracking-tight mb-2 group-hover:text-red-500 transition-colors">{work.title}</h3>
              <p className="text-gray-500 uppercase tracking-widest text-sm">{work.category}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 px-6 md:px-20 border-t border-white/10 flex flex-col md:flex-row justify-between items-end gap-10">
        <div>
          <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-6">Let's<br/>Talk</h2>
          <a href="mailto:hello@kingstudio.com" className="text-2xl md:text-4xl text-red-500 hover:text-white transition-colors underline decoration-2 underline-offset-8">hello@kingstudio.com</a>
        </div>
        <div className="flex gap-8 text-sm font-bold uppercase tracking-widest text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">Behance</a>
        </div>
      </footer>
    </div>
  );
}
