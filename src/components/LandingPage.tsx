"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-pink-200/40 dark:bg-pink-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-rose-200/30 dark:bg-rose-500/10 rounded-full blur-2xl" />

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center max-w-lg mx-auto"
        initial={{ y: 40 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Heart icon */}
        <motion.div
          className="mb-6 inline-flex items-center justify-center"
          animate={{
            scale: [1, 1.15, 1, 1.1, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="relative">
            <Heart className="w-20 h-20 text-pink-400 fill-pink-400 drop-shadow-lg" />
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 fill-yellow-400" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-rose-400 to-pink-400 bg-clip-text text-transparent leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          Hôm nay mình
          <br />
          đi đâu nè? 💕
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mt-4 text-base sm:text-lg text-pink-600/80 dark:text-pink-300/80 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          Bé ơi, chọn cho anh biết bé thích đi đâu nhé!
          <br />
          Chấm điểm từ 1-10, anh sẽ plan date xịn cho mình 🥰
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mt-8"
        >
          <motion.button
            onClick={onStart}
            className="group relative px-10 py-4 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white font-semibold text-lg rounded-full shadow-lg shadow-pink-300/50 dark:shadow-pink-500/30 transition-all duration-300 cursor-pointer"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(244, 114, 182, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Bắt đầu nào
              <Heart className="w-5 h-5 fill-white group-hover:animate-heartbeat" />
            </span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        </motion.div>

        {/* Fun emoji row */}
        <motion.div
          className="mt-10 flex justify-center gap-3 text-2xl opacity-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.8, duration: 0.7 }}
        >
          {["☕", "🎬", "🍲", "🧋", "🎤", "🌙", "🍦"].map((emoji, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
