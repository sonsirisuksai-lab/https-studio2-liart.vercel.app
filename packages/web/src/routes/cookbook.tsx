import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Flame, Clock, Users, Star, Award, BookOpen, Utensils, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const RECIPES = [
  {
    id: 1,
    title: "Vanguard Seared Wagyu",
    category: "Meat",
    prepTime: "25 min",
    servings: "2",
    rating: "5.0",
    difficulty: "Advanced",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop",
    ingredients: ["500g A5 Wagyu Beef", "Coarse Sea Salt", "Fresh Rosemary", "Garlic cloves", "Clarified Butter"],
    steps: ["Temper the wagyu steak for 30 minutes before cooking.", "Dry the surface thoroughly and season generously with sea salt.", "Sear in an ultra-hot cast iron skillet for 1.5 minutes per side.", "Baste with foaming butter, garlic, and rosemary for 30 seconds.", "Rest for 10 minutes before carving."]
  },
  {
    id: 2,
    title: "Straw Hat Ramen Bowl",
    category: "Ramen",
    prepTime: "40 min",
    servings: "1",
    rating: "4.9",
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=600&auto=format&fit=crop",
    ingredients: ["Tonkotsu broth", "Ramen noodles", "Chashu pork belly", "Ajitsuke Tamago (soft egg)", "Nori sheet", "Scallions"],
    steps: ["Heat broth to a rolling simmer.", "Boil noodles for exactly 2 minutes and drain.", "Place noodles in bowl and ladle hot broth over them.", "Arrange sliced chashu, halved egg, nori, and scallions on top."]
  },
  {
    id: 3,
    title: "Navigator Salmon Tataki",
    category: "Seafood",
    prepTime: "15 min",
    servings: "2",
    rating: "4.8",
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop",
    ingredients: ["Fresh salmon fillet", "Sesame seeds", "Ponzu sauce", "Microgreens", "Ginger paste"],
    steps: ["Roll the salmon fillet in sesame seeds.", "Sear quickly for 15 seconds per side in a screaming-hot pan.", "Plunge into ice water to stop cooking immediately.", "Slice thinly and serve with ponzu sauce and microgreens."]
  }
];

export default function Cookbook() {
  const [selectedRecipe, setSelectedRecipe] = useState<typeof RECIPES[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Meat', 'Ramen', 'Seafood'];

  const filteredRecipes = RECIPES.filter(recipe => {
    const matchesCategory = activeCategory === 'All' || recipe.category === activeCategory;
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          recipe.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#070503] text-stone-100 font-sans p-6 overflow-hidden relative pb-24">
      {/* Warm fireglow overlay */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 relative z-10 border-b border-stone-800/60 pb-6">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-amber-500 font-bold">Culinary Lab</span>
          <h1 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
            <Utensils className="w-6 h-6 text-amber-500" />
            Cosmos Cookbook
          </h1>
        </div>
        
        {/* Search */}
        <div className="flex gap-3 max-w-sm w-full">
          <div className="flex-1 bg-stone-900 border border-stone-800/80 rounded-2xl flex items-center px-4 py-2 text-sm">
            <Search className="w-4 h-4 text-stone-500 mr-2" />
            <input 
              type="text" 
              placeholder="Search dishes or ingredients..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-stone-200 placeholder:text-stone-500 w-full"
            />
          </div>
        </div>
      </header>

      {/* Categories select */}
      <div className="flex gap-2 mb-8 relative z-10 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setSelectedRecipe(null);
            }}
            className={`px-5 py-2 rounded-full text-xs uppercase font-bold tracking-wider border transition-all duration-300 ${
              activeCategory === cat 
                ? 'bg-amber-500 border-amber-500 text-stone-950 font-black shadow-[0_4px_15px_rgba(245,158,11,0.3)]' 
                : 'bg-stone-900/60 border-stone-800/80 text-stone-400 hover:text-stone-200 hover:border-stone-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid View */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Bento List Left side */}
        <div className="lg:col-span-2 grid gap-6">
          {filteredRecipes.map((recipe) => (
            <motion.div
              key={recipe.id}
              whileHover={{ scale: 1.01, y: -2 }}
              onClick={() => setSelectedRecipe(recipe)}
              className={`p-5 rounded-3xl bg-stone-900/40 border border-stone-800/80 cursor-pointer transition-all flex gap-5 items-center relative overflow-hidden group ${
                selectedRecipe?.id === recipe.id ? 'border-amber-500/50 bg-amber-500/[0.02]' : ''
              }`}
            >
              <div className="w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-stone-800 border border-stone-800 relative">
                <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <span className="absolute top-2 left-2 bg-stone-950/80 text-amber-500 font-black font-mono text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {recipe.category}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold group-hover:text-amber-400 transition-colors uppercase leading-snug">{recipe.title}</h3>
                  <ArrowUpRight className="w-5 h-5 text-stone-500 group-hover:text-amber-500 transition-colors" />
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-stone-400">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {recipe.prepTime}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {recipe.servings} serving</span>
                  <span className="flex items-center gap-1 text-amber-500"><Star className="w-3.5 h-3.5 fill-amber-500" /> {recipe.rating}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recipe Lab Panel Right side */}
        <div className="bg-stone-900/60 border border-stone-800/80 rounded-[32px] p-6 backdrop-blur-md relative overflow-hidden h-fit">
          <AnimatePresence mode="wait">
            {selectedRecipe ? (
              <motion.div
                key={selectedRecipe.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-500 font-bold">
                  <Flame className="w-4 h-4 animate-pulse" />
                  <span>Interactive Cooking Guide</span>
                </div>

                <h3 className="text-2xl font-black uppercase text-stone-100 leading-tight tracking-tight border-b border-stone-800 pb-3">{selectedRecipe.title}</h3>

                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-stone-400">Ingredients ({selectedRecipe.ingredients.length})</h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {selectedRecipe.ingredients.map((ing, i) => (
                      <li key={i} className="text-xs text-stone-300 flex items-center gap-1.5 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4 border-t border-stone-800 pt-4">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-stone-400">Instructions</h4>
                  <ol className="space-y-3 text-sm text-stone-400 leading-relaxed">
                    {selectedRecipe.steps.map((step, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-amber-500 font-black font-mono text-xs mt-0.5">{i+1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-20 flex flex-col items-center justify-center">
                <BookOpen className="w-12 h-12 text-stone-600 mb-4 animate-bounce" style={{ animationDuration: '3s' }} />
                <h3 className="text-lg font-black uppercase text-stone-400 mb-2">Recipe Lab Standby</h3>
                <p className="text-xs text-stone-500 leading-relaxed max-w-[200px] mx-auto uppercase tracking-wide">
                  Select a legendary recipe from the list to begin cooking instruction.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
