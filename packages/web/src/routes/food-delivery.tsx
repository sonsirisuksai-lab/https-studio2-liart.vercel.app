import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, SlidersHorizontal, Star, Plus, Home, Heart, Bell, User } from 'lucide-react';

const CATEGORIES = [
  { id: 'ramen', name: 'Ramen', icon: '🍜' },
  { id: 'sushi', name: 'Sushi', icon: '🍣' },
  { id: 'rolls', name: 'Rolls', icon: '🍱' },
  { id: 'drinks', name: 'Drinks', icon: '🍹' },
];

const FOOD_ITEMS = [
  { id: 1, name: 'Sake Sushi', price: 12.99, rating: 4.8, prepTime: '15-20 min', kcal: '250', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=400&auto=format&fit=crop' },
  { id: 2, name: 'Tonkotsu Ramen', price: 14.50, rating: 4.9, prepTime: '20-30 min', kcal: '450', image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?q=80&w=400&auto=format&fit=crop' },
  { id: 3, name: 'Dragon Roll', price: 16.00, rating: 4.7, prepTime: '15-25 min', kcal: '320', image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=400&auto=format&fit=crop' },
];

export default function FoodDelivery() {
  const [activeCategory, setActiveCategory] = useState('sushi');
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-800 font-sans pb-24 relative overflow-hidden">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex justify-between items-center bg-white rounded-b-[40px] shadow-sm relative z-10">
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Your Location</p>
          <div className="flex items-center gap-1 font-bold text-lg">
            <MapPin className="w-5 h-5 text-orange-500" />
            New York, USA
          </div>
        </div>
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
          <img src="https://i.pravatar.cc/150?img=32" alt="Profile" className="w-full h-full object-cover" />
        </div>
      </header>

      {/* Main Content */}
      <div className="px-6 mt-6">
        
        {/* Search */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 bg-white rounded-2xl flex items-center px-4 py-3 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100">
            <Search className="w-5 h-5 text-slate-400 mr-3" />
            <input 
              type="text" 
              placeholder="Search for food..." 
              className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
            />
          </div>
          <button className="w-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:bg-orange-600 transition-colors">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Promo Banner */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-slate-900 rounded-[32px] p-6 text-white mb-8 relative overflow-hidden shadow-xl"
        >
          <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-orange-500 rounded-full opacity-20 blur-2xl" />
          <div className="relative z-10 w-2/3">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-md mb-3">Promo</span>
            <h2 className="text-2xl font-bold mb-2">Get 50% discount</h2>
            <p className="text-sm text-slate-300">On your first order today!</p>
          </div>
          {/* Decorative food image or illustration could go here */}
          <div className="absolute right-[-20px] bottom-[-20px] w-40 h-40 bg-orange-500 rounded-full flex items-center justify-center opacity-90 shadow-2xl overflow-hidden border-8 border-slate-900">
            <span className="text-6xl">🍔</span>
          </div>
        </motion.div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-bold text-slate-900">Categories</h2>
            <button className="text-sm text-orange-500 font-semibold">See all</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex flex-col items-center flex-shrink-0 w-20 py-4 rounded-[24px] transition-all duration-300 ${
                    isActive 
                      ? 'bg-orange-500 text-white shadow-[0_8px_20px_rgba(249,115,22,0.3)] scale-105' 
                      : 'bg-white text-slate-600 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 ${isActive ? 'bg-white/20' : 'bg-slate-100'}`}>
                    {cat.icon}
                  </div>
                  <span className="text-sm font-semibold">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Popular Food */}
        <div>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-bold text-slate-900">Popular Food</h2>
            <button className="text-sm text-orange-500 font-semibold">See all</button>
          </div>
          <div className="grid gap-6">
            {FOOD_ITEMS.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-[28px] p-4 flex gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100 items-center relative overflow-hidden group"
              >
                <div className="w-24 h-24 rounded-[20px] overflow-hidden flex-shrink-0 bg-slate-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-lg text-slate-900">{item.name}</h3>
                    <div className="flex items-center gap-1 text-sm font-bold">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {item.rating}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mb-3">{item.kcal} kcal • {item.prepTime}</p>
                  <div className="flex justify-between items-center">
                    <p className="font-black text-xl text-slate-900">${item.price}</p>
                  </div>
                </div>
                {/* Add to cart button */}
                <button className="absolute bottom-4 right-4 w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center hover:bg-orange-500 transition-colors shadow-md">
                  <Plus className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 w-full px-6 py-6 pb-8 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-50 flex justify-between items-center rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        {[
          { id: 'home', icon: Home },
          { id: 'favorites', icon: Heart },
          { id: 'notifications', icon: Bell },
          { id: 'profile', icon: User },
        ].map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`p-3 rounded-2xl transition-all duration-300 relative ${
                isActive 
                  ? 'text-orange-500' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 bg-orange-100 rounded-2xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <item.icon className="w-6 h-6 relative z-10" />
            </button>
          )
        })}
      </div>

    </div>
  );
}
