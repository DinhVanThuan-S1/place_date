"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 dark:from-[#1a0a1e] dark:via-[#1f0f28] dark:to-[#160a1a]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1, 1.15, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Heart className="w-16 h-16 text-pink-400 fill-pink-400" />
      </motion.div>
      <motion.p
        className="mt-6 text-lg font-medium text-pink-500 dark:text-pink-300"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Đang tải... 💕
      </motion.p>
      <div className="mt-4 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-pink-300 dark:bg-pink-500"
            animate={{
              y: [0, -10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
