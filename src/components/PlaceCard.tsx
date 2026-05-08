"use client";

import { motion } from "framer-motion";
import { Place } from "@/types";
import { Slider } from "@/components/ui/slider";
import { Heart } from "lucide-react";

interface PlaceCardProps {
  place: Place;
  score: number;
  onScoreChange: (score: number) => void;
  index: number;
}

export default function PlaceCard({
  place,
  score,
  onScoreChange,
  index,
}: PlaceCardProps) {
  return (
    <motion.div
      className="glass rounded-3xl p-5 sm:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-pink-200/40 dark:hover:shadow-pink-500/10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -2 }}
    >
      {/* Header row */}
      <div className="flex items-center gap-3 mb-4">
        <motion.span
          className="text-3xl sm:text-4xl"
          whileHover={{ scale: 1.2, rotate: 10 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {place.emoji}
        </motion.span>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base sm:text-lg text-foreground truncate">
            {place.name}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">
            {place.description}
          </p>
        </div>
        {/* Score display */}
        <motion.div
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold transition-colors duration-300 ${
            score > 0
              ? "bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-md shadow-pink-200/50"
              : "bg-pink-100/60 dark:bg-pink-900/20 text-pink-300"
          }`}
          animate={score > 0 ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart
            className={`w-3.5 h-3.5 ${
              score > 0 ? "fill-white" : "fill-pink-200 dark:fill-pink-700"
            }`}
          />
          {score}
        </motion.div>
      </div>

      {/* Slider */}
      <div className="px-1">
        <Slider
          defaultValue={[0]}
          value={[score]}
          min={0}
          max={10}
          onValueChange={(val) => {
            const values = Array.isArray(val) ? val : [val];
            onScoreChange(values[0]);
          }}
        />
      </div>

      {/* Heart indicators */}
      <div className="flex justify-center gap-0.5 mt-3">
        {Array.from({ length: 10 }, (_, i) => (
          <motion.button
            key={i}
            type="button"
            onClick={() => onScoreChange(i + 1)}
            className="p-0.5 cursor-pointer"
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.8 }}
          >
            <Heart
              className={`w-4 h-4 sm:w-[18px] sm:h-[18px] transition-colors duration-200 ${
                i < score
                  ? "fill-pink-400 text-pink-400"
                  : "fill-pink-100 text-pink-200 dark:fill-pink-900/30 dark:text-pink-800"
              }`}
            />
          </motion.button>
        ))}
      </div>

      {/* Category tag */}
      <div className="mt-3 flex justify-center">
        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-pink-100/80 dark:bg-pink-900/30 text-pink-500 dark:text-pink-300 font-medium">
          {place.category}
        </span>
      </div>
    </motion.div>
  );
}
