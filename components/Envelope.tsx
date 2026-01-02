"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface EnvelopeProps {
  onOpen: () => void;
}

export default function Envelope({ onOpen }: EnvelopeProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 1500); // Wait for animation
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1a1a1a] overflow-hidden [perspective:1000px]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-[350px] h-[250px] md:w-[500px] md:h-[350px] cursor-pointer group [transform-style:preserve-3d]"
        onClick={!isOpening ? handleOpen : undefined}
      >
        {/* Envelope Body (Back) */}
        <div className="absolute inset-0 bg-[#e0c097] rounded-lg shadow-2xl [transform-style:preserve-3d]"></div>

        {/* Paper inside */}
        <motion.div
          initial={{ y: 0 }}
          animate={isOpening ? { y: -150 } : { y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute left-4 right-4 top-4 bottom-4 bg-white rounded shadow-md flex flex-col items-center justify-center p-4 z-10"
        >
          <h2 className="text-2xl font-serif text-red-600 font-bold mb-2">Chúc Mừng Năm Mới</h2>
          <p className="text-gray-600 font-serif italic">2026</p>
        </motion.div>

        {/* Envelope Flap (Top) */}
        <motion.div
          initial={{ rotateX: 0 }}
          animate={isOpening ? { rotateX: 180, zIndex: 0 } : { rotateX: 0, zIndex: 20 }}
          transition={{ duration: 0.8 }}
          style={{ 
            transformOrigin: "top",
            clipPath: "polygon(0 0, 50% 100%, 100% 0)"
          }}
          className="absolute top-0 left-0 right-0 h-1/2 bg-[#ccaa80] rounded-t-lg z-20 shadow-lg"
        >
        </motion.div>

        {/* Envelope Body (Front - Bottom) */}
        <div className="absolute bottom-0 left-0 right-0 h-full bg-[#e0c097] rounded-b-lg z-20 pointer-events-none" 
             style={{ clipPath: "polygon(0 0, 50% 40%, 100% 0, 100% 100%, 0 100%)" }}>
             {/* This creates the pocket shape */}
             <div className="absolute bottom-4 right-6 text-right">
                <p className="text-[#5a4a3a] font-serif text-sm">Người gửi:</p>
                <p className="text-[#8b4513] font-serif font-bold text-lg">Phạm Hữu Thân Thương</p>
             </div>
        </div>
        
        {/* Seal */}
        <motion.div 
            animate={isOpening ? { opacity: 0 } : { opacity: 1 }}
            className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-red-700 rounded-full shadow-lg flex items-center justify-center border-2 border-red-800"
        >
            <span className="text-yellow-400 font-bold text-xs">2026</span>
        </motion.div>

        {/* Button (only visible if not opening) */}
        {!isOpening && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 z-0"
            >
                <button 
                    onClick={(e) => { e.stopPropagation(); handleOpen(); }}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold shadow-lg transition-colors border-2 border-yellow-400"
                >
                    Mở Thư
                </button>
            </motion.div>
        )}
      </motion.div>
    </div>
  );
}
