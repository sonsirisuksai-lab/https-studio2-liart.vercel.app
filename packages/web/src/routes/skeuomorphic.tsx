import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Skeuomorphic() {
  const [switches, setSwitches] = useState({
    cyber: false,
    steel: true,
    power: false,
  });

  const [receiptPrinted, setReceiptPrinted] = useState(false);

  return (
    <div className="min-h-screen bg-[#DEDFD9] text-[#2C2E33] font-sans p-6 overflow-x-hidden pb-32">
      
      <div className="max-w-4xl mx-auto space-y-20 pt-10">
        
        {/* Switches Section */}
        <section>
          <div className="flex items-center gap-4 mb-8 border-b-2 border-[#2C2E33]/10 pb-4">
            <h2 className="text-xl font-bold tracking-widest uppercase text-[#2C2E33]/50 shadow-white/50 text-shadow-sm">Control Panel</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Cyber Tech Switch */}
            <div className="bg-[#EAEAEA] p-8 rounded-3xl shadow-[8px_8px_16px_#c3c3c3,-8px_-8px_16px_#ffffff] flex flex-col items-center border border-white/50">
              <div className="mb-8 w-full flex justify-between items-center px-4">
                <span className="font-bold text-sm tracking-widest uppercase text-slate-500">Cyber-Tech</span>
                <div className={`w-3 h-3 rounded-full shadow-inner ${switches.cyber ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-slate-300'}`} />
              </div>
              
              <button 
                onClick={() => setSwitches(s => ({ ...s, cyber: !s.cyber }))}
                className="relative w-24 h-48 bg-[#D3D3D3] rounded-full p-2 shadow-inner border border-slate-300 flex flex-col justify-between"
              >
                {/* Track */}
                <div className="absolute inset-2 rounded-full bg-[#111] shadow-inner opacity-10 pointer-events-none" />
                
                {/* Knob */}
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-br from-[#F5F5F5] to-[#B0B0B0] rounded-full shadow-[0_8px_15px_rgba(0,0,0,0.3),inset_0_2px_2px_white] border border-slate-300 flex items-center justify-center cursor-pointer z-10"
                  animate={{ y: switches.cyber ? 96 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#E0E0E0] to-[#F5F5F5] shadow-inner flex items-center justify-center">
                    <div className="w-8 h-2 rounded-full bg-slate-300 shadow-inner" />
                  </div>
                </motion.div>
              </button>
            </div>

            {/* Blue Steel Switch */}
            <div className="bg-[#EAEAEA] p-8 rounded-3xl shadow-[8px_8px_16px_#c3c3c3,-8px_-8px_16px_#ffffff] flex flex-col items-center border border-white/50">
              <div className="mb-8 w-full flex justify-between items-center px-4">
                <span className="font-bold text-sm tracking-widest uppercase text-slate-500">Blue-Steel</span>
                <div className={`w-3 h-3 rounded-full shadow-inner ${switches.steel ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-slate-300'}`} />
              </div>
              
              <button 
                onClick={() => setSwitches(s => ({ ...s, steel: !s.steel }))}
                className="relative w-40 h-24 bg-[#D3D3D3] rounded-full p-2 shadow-[inset_0_4px_8px_rgba(0,0,0,0.2)] border border-slate-400 flex items-center"
              >
                {/* Knob */}
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-b from-[#4A6478] to-[#2C3E50] rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-2px_4px_rgba(0,0,0,0.5)] border-2 border-[#1A252F] flex items-center justify-center cursor-pointer z-10"
                  animate={{ x: switches.steel ? 64 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {/* Grip texture */}
                  <div className="flex gap-1">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-1 h-10 rounded-full bg-[#1A252F] shadow-[inset_1px_0_1px_rgba(255,255,255,0.2)]" />
                    ))}
                  </div>
                </motion.div>
              </button>
            </div>

            {/* Main Power Button */}
            <div className="bg-[#EAEAEA] p-8 rounded-3xl shadow-[8px_8px_16px_#c3c3c3,-8px_-8px_16px_#ffffff] flex flex-col items-center justify-center border border-white/50">
               <div className="mb-6">
                <span className="font-bold text-sm tracking-widest uppercase text-slate-500">Master Power</span>
              </div>
              <motion.button
                onClick={() => setSwitches(s => ({ ...s, power: !s.power }))}
                whileTap={{ scale: 0.95 }}
                className={`w-32 h-32 rounded-full border-4 ${switches.power ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]' : 'border-[#D3D3D3] shadow-[8px_8px_16px_#c3c3c3,-8px_-8px_16px_#ffffff]'} flex items-center justify-center transition-colors duration-300 relative`}
              >
                 <div className={`w-28 h-28 rounded-full flex items-center justify-center shadow-inner ${switches.power ? 'bg-gradient-to-br from-red-400 to-red-600' : 'bg-gradient-to-br from-[#E0E0E0] to-[#F5F5F5]'}`}>
                    <div className={`w-12 h-12 rounded-full border-4 border-t-transparent ${switches.power ? 'border-white' : 'border-slate-400'} rotate-45 flex items-center justify-center`}>
                      <div className={`w-1 h-6 -translate-y-4 ${switches.power ? 'bg-white' : 'bg-slate-400'}`} />
                    </div>
                 </div>
              </motion.button>
            </div>

          </div>
        </section>

        {/* Receipt Section */}
        <section className="flex flex-col items-center">
          <div className="w-full max-w-sm">
            
            {/* Slot */}
            <div className="w-full h-12 bg-[#2C2E33] rounded-t-xl rounded-b-md shadow-[inset_0_-8px_10px_rgba(0,0,0,0.8),0_4px_4px_rgba(255,255,255,0.5)] border-t border-slate-500 flex justify-center items-end relative z-20">
               <div className="w-[90%] h-2 bg-black rounded-full mb-1 shadow-inner blur-[1px]" />
            </div>

            {/* Receipt Paper */}
            <div className="relative -mt-2 w-[85%] mx-auto z-10 flex justify-center">
              <motion.div 
                className="w-full bg-[#F4F4F0] text-black shadow-[0_20px_25px_-5px_rgba(0,0,0,0.2),0_10px_10px_-5px_rgba(0,0,0,0.1)] origin-top border border-black/5"
                initial={{ height: 0 }}
                animate={{ height: receiptPrinted ? 400 : 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                style={{ overflow: 'hidden' }}
              >
                 <div className="p-6 font-mono text-xs w-full pb-10" style={{ backgroundImage: 'radial-gradient(#d4d4d4 1px, transparent 1px)', backgroundSize: '20px 20px', backgroundPosition: 'center', backgroundColor: '#F4F4F0' }}>
                    <div className="text-center mb-6 border-b-2 border-dashed border-black/20 pb-4">
                      <h3 className="text-lg font-black tracking-widest mb-1">COSMOS STORE</h3>
                      <p>123 UI/UX Boulevard</p>
                      <p>Design City, DC 001</p>
                    </div>

                    <div className="space-y-4 mb-6 border-b-2 border-dashed border-black/20 pb-4">
                      <p className="font-bold">PAYMENT SUCCESSFUL</p>
                      <p>Date: {new Date().toLocaleDateString()}</p>
                      <p>Time: {new Date().toLocaleTimeString()}</p>
                      <p>Receipt ID: #8493-2A</p>
                    </div>

                    <div className="space-y-2 mb-6 border-b-2 border-dashed border-black/20 pb-4">
                      <div className="flex justify-between">
                        <span>1x Dark Theme</span>
                        <span>$12.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>3x UI Components</span>
                        <span>$45.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>1x Skueo Button</span>
                        <span>$8.50</span>
                      </div>
                    </div>

                    <div className="space-y-1 mb-8">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>$65.50</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (8%)</span>
                        <span>$5.24</span>
                      </div>
                      <div className="flex justify-between text-base font-bold mt-2">
                        <span>TOTAL</span>
                        <span>$70.74</span>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="mb-2">THANK YOU FOR YOUR PURCHASE!</p>
                      <div className="w-full h-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjQwIiBmaWxsPSJibGFjayIgeD0iMTAiLz48cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0MCIgZmlsbD0iYmxhY2siIHg9IjE1Ii8+PHJlY3Qgd2lkdGg9IjEiIGhlaWdodD0iNDAiIGZpbGw9ImJsYWNrIiB4PSIyMiIvPjxyZWN0IHdpZHRoPSI1IiBoZWlnaHQ9IjQwIiBmaWxsPSJibGFjayIgeD0iMjUiLz48cmVjdCB3aWR0aD0iMyIgaGVpZ2h0PSI0MCIgZmlsbD0iYmxhY2siIHg9IjM1Ii8+PHJlY3Qgd2lkdGg9IjEiIGhlaWdodD0iNDAiIGZpbGw9ImJsYWNrIiB4PSI0MSIvPjxyZWN0IHdpZHRoPSI2IiBoZWlnaHQ9IjQwIiBmaWxsPSJibGFjayIgeD0iNDUiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSI0MCIgZmlsbD0iYmxhY2siIHg9IjU1Ii8+PC9zdmc+')] bg-repeat-x opacity-60" />
                    </div>
                 </div>

                 {/* Torn Edge Effect */}
                 <div className="absolute bottom-0 left-0 w-full h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMCAxMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PHBvbHlnb24gZmlsbD0iI0Q1RDZEMCIgcG9pbnRzPSIwLDEwIDEwLDEwIDEwLDAgNSwxMCAwLDAiLz48L3N2Zz4=')] bg-repeat-x" style={{ backgroundSize: '10px 10px', filter: 'drop-shadow(0px 5px 2px rgba(0,0,0,0.1))' }} />
              </motion.div>
            </div>

            <div className="mt-8 flex justify-center">
              <button 
                onClick={() => setReceiptPrinted(!receiptPrinted)}
                className="px-6 py-3 bg-[#2C2E33] text-[#DEDFD9] rounded-full font-bold uppercase tracking-widest shadow-[4px_4px_10px_#a3a49f,-4px_-4px_10px_#ffffff] active:shadow-inner active:bg-[#1f2024] transition-all"
              >
                {receiptPrinted ? 'Tear Receipt' : 'Print Receipt'}
              </button>
            </div>

          </div>
        </section>
        
      </div>
    </div>
  );
}
