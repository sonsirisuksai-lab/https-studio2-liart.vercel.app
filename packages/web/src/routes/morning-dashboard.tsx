import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, Menu, Search, User } from 'lucide-react';

export default function MorningDashboard() {
  return (
    <div className="min-h-screen bg-[#111] text-white font-sans p-6 overflow-hidden relative">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />
      
      <header className="flex justify-between items-center mb-10 relative z-10">
        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/5">
          <Menu className="w-6 h-6" />
        </div>
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/5">
            <Search className="w-6 h-6" />
          </div>
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/5 overflow-hidden p-1">
            <img src="https://i.pravatar.cc/150?img=68" alt="Profile" className="w-full h-full rounded-xl object-cover" />
          </div>
        </div>
      </header>

      <div className="mb-10 relative z-10">
        <h1 className="text-5xl font-semibold mb-2 tracking-tight">Good<br/>Morning,</h1>
        <h2 className="text-4xl text-gray-400 font-light">Alex!</h2>
      </div>

      <div className="grid gap-6 relative z-10">
        
        {/* Tasks Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 flex justify-between items-center relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div>
            <h3 className="text-2xl font-bold mb-1">5/10</h3>
            <p className="text-gray-400">Tasks completed</p>
          </div>
          <div className="w-16 h-16 relative">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="4"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#60A5FA"
                strokeWidth="4"
                strokeDasharray="50, 100"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-blue-400">
               <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        {/* Discovery Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 relative overflow-hidden group"
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl group-hover:bg-orange-500/30 transition-colors duration-500" />
          
          <div className="flex justify-between items-start mb-16 relative z-10">
            <div>
              <p className="text-gray-400 mb-1">Discover a new restaurant</p>
              <h3 className="text-3xl font-bold">Fukuno<br/>Restaurant</h3>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.4)]">
              <ChevronRight className="w-6 h-6" />
            </div>
          </div>

          {/* Abstract 3D Object Representation (CSS art) */}
          <div className="absolute bottom-[-20px] right-[-20px] w-48 h-48 pointer-events-none drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]">
             <div className="absolute w-24 h-24 bg-gradient-to-br from-orange-300 to-red-500 rounded-full right-10 bottom-10 animate-bounce" style={{ animationDuration: '4s' }} />
             <div className="absolute w-16 h-16 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-full right-24 bottom-24 animate-pulse" style={{ animationDuration: '3s' }} />
             <div className="absolute w-32 h-12 bg-black/40 blur-md rounded-full right-8 bottom-4" />
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-6">
          {/* Coffee Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 relative overflow-hidden aspect-square flex flex-col justify-end group"
          >
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-amber-700/20 rounded-full blur-2xl group-hover:bg-amber-700/30 transition-colors duration-500" />
            <h3 className="text-xl font-bold relative z-10">Morning<br/>Coffee</h3>
            
            {/* Abstract Coffee Cup */}
            <div className="absolute top-4 right-4 w-20 h-24 bg-gradient-to-b from-amber-600/50 to-amber-900/50 rounded-b-2xl rounded-t-sm border border-white/10 backdrop-blur-sm drop-shadow-xl flex justify-center">
              <div className="w-12 h-2 bg-gradient-to-r from-amber-200 to-amber-500 rounded-full mt-2" />
            </div>
          </motion.div>

          {/* Cocktails Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 relative overflow-hidden aspect-square flex flex-col justify-end group"
          >
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-pink-500/20 rounded-full blur-2xl group-hover:bg-pink-500/30 transition-colors duration-500" />
            <h3 className="text-xl font-bold relative z-10">Evening<br/>Cocktails</h3>
            
            {/* Abstract Glass */}
            <div className="absolute top-4 left-4 w-16 h-24 border-x-4 border-b-4 border-white/20 rounded-b-xl backdrop-blur-sm drop-shadow-xl overflow-hidden flex flex-col justify-end">
               <div className="w-full h-1/2 bg-gradient-to-t from-pink-500/80 to-purple-500/80 rounded-b-lg" />
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
