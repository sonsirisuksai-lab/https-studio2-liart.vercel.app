import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Calendar, Clock, Star, Play, Search, MapPin, Grid, Ticket, User, Heart } from 'lucide-react';

const MOVIES = [
  {
    id: 1,
    title: "F1 THE MOVIE",
    duration: "2h 32m",
    rating: "7.4/10",
    genres: ["Action", "Drama", "History"],
    image: "https://images.unsplash.com/photo-1532906803767-fce06b2dbf2d?q=80&w=600&auto=format&fit=crop",
    stars: 4,
  },
  {
    id: 2,
    title: "OPPENHEIMER",
    duration: "3h 0m",
    rating: "8.6/10",
    genres: ["Biography", "Drama", "History"],
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600&auto=format&fit=crop",
    stars: 5,
  },
  {
    id: 3,
    title: "DUNE: PART TWO",
    duration: "2h 46m",
    rating: "8.8/10",
    genres: ["Action", "Adventure", "Sci-Fi"],
    image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=600&auto=format&fit=crop",
    stars: 5,
  }
];

const DATES = ["22 Sat", "23 Sun", "24 Mon", "25 Tue", "26 Wed"];
const TIMES = ["10:30 AM", "12:15 PM", "02:45 PM", "05:00 PM", "08:30 PM"];

export default function CinemaUniverse() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedMovie, setSelectedMovie] = useState<typeof MOVIES[0] | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState(2);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const toggleSeat = (seat: string) => {
    setSelectedSeats(prev => 
      prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]
    );
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden relative">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-900/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {!selectedMovie ? (
          <motion.div 
            key="home"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 h-screen overflow-y-auto pb-24"
          >
            <header className="flex justify-between items-center mb-8">
              <div>
                <p className="text-gray-400 text-sm">Welcome back</p>
                <h1 className="text-2xl font-bold">Discover Movies</h1>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
                <Search className="w-5 h-5" />
              </div>
            </header>

            <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
              {['Now Playing', 'Coming Soon', 'Top Rated'].map((tab, i) => (
                <button 
                  key={tab}
                  className={`whitespace-nowrap px-6 py-2 rounded-full font-medium transition-colors ${
                    i === 0 ? 'bg-red-600 text-white' : 'bg-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid gap-6">
              {MOVIES.map((movie) => (
                <motion.div 
                  key={movie.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedMovie(movie)}
                  className="relative h-96 rounded-3xl overflow-hidden cursor-pointer group"
                >
                  <img src={movie.image} alt={movie.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 w-full p-6">
                    <div className="flex justify-between items-end">
                      <div>
                        <h2 className="text-3xl font-bold mb-2 tracking-tight">{movie.title}</h2>
                        <div className="flex items-center gap-4 text-sm text-gray-300">
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {movie.duration}</span>
                          <span className="flex items-center gap-1 text-yellow-500"><Star className="w-4 h-4 fill-current" /> {movie.rating}</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                        <Play className="w-5 h-5 ml-1" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : !isBooking ? (
          <motion.div 
            key="details"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen overflow-y-auto relative pb-24"
          >
            <div className="h-[60vh] relative">
              <img src={selectedMovie.image} alt={selectedMovie.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              
              <button 
                onClick={() => setSelectedMovie(null)}
                className="absolute top-6 left-6 w-12 h-12 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button className="absolute top-6 right-6 w-12 h-12 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10">
                <Heart className="w-6 h-6" />
              </button>

              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 cursor-pointer hover:bg-white/30 transition-colors"
                >
                  <Play className="w-8 h-8 ml-1" />
                </motion.div>
              </div>
            </div>

            <div className="px-6 -mt-20 relative z-10">
              <h1 className="text-4xl font-bold mb-4">{selectedMovie.title}</h1>
              
              <div className="flex gap-4 mb-6 text-sm text-gray-400">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {selectedMovie.duration}</span>
                <span className="flex items-center gap-1 text-yellow-500"><Star className="w-4 h-4 fill-current" /> IMDB {selectedMovie.rating}</span>
              </div>

              <div className="flex gap-3 mb-8">
                {selectedMovie.genres.map(genre => (
                  <span key={genre} className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm backdrop-blur-sm">
                    {genre}
                  </span>
                ))}
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Synopsis</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Experience the adrenaline, the rivalry, and the pure speed of Formula 1. Follow the journey of a veteran driver attempting a final comeback against a brilliant but reckless rookie.
                </p>
              </div>

              <div className="mb-10">
                <h3 className="text-lg font-semibold mb-4">Cast</h3>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex-shrink-0 text-center">
                      <div className="w-16 h-16 rounded-full bg-white/10 mb-2 border border-white/5 overflow-hidden">
                         <img src={`https://i.pravatar.cc/150?img=${i+10}`} alt="Actor" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs text-gray-400">Actor {i}</p>
                    </div>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsBooking(true)}
                className="w-full py-4 bg-red-600 rounded-2xl font-bold text-lg shadow-[0_0_30px_rgba(220,38,38,0.4)]"
              >
                Select Seats
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="booking"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="h-screen flex flex-col bg-[#0a0a0a]"
          >
            <header className="p-6 flex items-center justify-between z-10">
              <button 
                onClick={() => setIsBooking(false)}
                className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-bold">Select Seats</h1>
              <div className="w-12 h-12" />
            </header>

            <div className="flex-1 overflow-y-auto px-6 pb-32">
              <div className="flex flex-col items-center mb-10">
                <div className="w-full max-w-md h-12 relative mb-12">
                   <div className="absolute inset-0 bg-gradient-to-t from-red-600/0 to-red-600/40 rounded-t-[100%] blur-xl" />
                   <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_20px_rgba(239,68,68,1)]" />
                   <p className="text-center text-xs text-gray-500 mt-4 uppercase tracking-[0.2em]">Screen</p>
                </div>

                <div className="grid gap-4 max-w-sm w-full mx-auto">
                  {['A', 'B', 'C', 'D', 'E', 'F'].map(row => (
                    <div key={row} className="flex justify-center gap-2">
                      <span className="w-6 text-xs text-gray-600 flex items-center justify-center mr-2">{row}</span>
                      {[1, 2, 3, 4, 5, 6, 7].map(col => {
                        const seatId = `${row}${col}`;
                        const isSelected = selectedSeats.includes(seatId);
                        const isReserved = (row === 'C' && col === 4) || (row === 'E' && col === 2);
                        
                        return (
                          <button
                            key={seatId}
                            disabled={isReserved}
                            onClick={() => toggleSeat(seatId)}
                            className={`w-8 h-8 rounded-t-lg rounded-b-sm transition-all duration-300 ${
                              isReserved ? 'bg-white/10 opacity-50 cursor-not-allowed' :
                              isSelected ? 'bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.6)] scale-110' :
                              'bg-white/20 hover:bg-white/30'
                            } ${col === 4 ? 'mr-6' : ''}`} // Aisle gap
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>

                <div className="flex justify-center gap-6 mt-10 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white/20 rounded-t-sm" /> Available
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-600 rounded-t-sm shadow-[0_0_10px_rgba(220,38,38,0.5)]" /> Selected
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white/10 rounded-t-sm opacity-50" /> Reserved
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Date</h3>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {DATES.map((date, i) => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(i)}
                      className={`flex-shrink-0 px-5 py-3 rounded-2xl text-sm transition-colors border ${
                        selectedDate === i 
                          ? 'bg-red-600/10 border-red-500 text-red-500' 
                          : 'bg-white/5 border-white/10 text-gray-300'
                      }`}
                    >
                      {date}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Time</h3>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {TIMES.map((time, i) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(i)}
                      className={`flex-shrink-0 px-5 py-3 rounded-2xl text-sm transition-colors border ${
                        selectedTime === i 
                          ? 'bg-red-600/10 border-red-500 text-red-500' 
                          : 'bg-white/5 border-white/10 text-gray-300'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <div className="fixed bottom-0 left-0 w-full bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/10 p-6 rounded-t-3xl">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-gray-400 text-sm">Total Price</p>
                  <p className="text-2xl font-bold">${(selectedSeats.length * 24.50).toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Seats</p>
                  <p className="text-lg font-semibold">{selectedSeats.length > 0 ? selectedSeats.join(', ') : '-'}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={selectedSeats.length === 0}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                  selectedSeats.length > 0 
                    ? 'bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.4)] text-white' 
                    : 'bg-white/10 text-gray-500 cursor-not-allowed'
                }`}
              >
                Buy Ticket
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      {!selectedMovie && (
        <div className="fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex justify-between items-center z-50">
          {[
            { id: 'home', icon: Grid },
            { id: 'tickets', icon: Ticket },
            { id: 'location', icon: MapPin },
            { id: 'profile', icon: User },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`p-3 rounded-2xl transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-red-600/20 text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.2)]' 
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              <item.icon className="w-6 h-6" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
