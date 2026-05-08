"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { places } from "@/data/places";
import { PlaceRating, RankedPlace } from "@/types";
import PlaceCard from "@/components/PlaceCard";
import { ArrowRight, Heart, Search, Filter, Dice6 } from "lucide-react";

interface RatingPageProps {
  onSubmit: (ratings: PlaceRating[], topPlaces: RankedPlace[]) => void;
  onRandomPick: () => void;
}

const categories = [
  "Tất cả",
  "Cafe",
  "Ẩm thực",
  "Giải trí",
  "Outdoor",
  "Tham quan",
  "Trải nghiệm",
  "Thư giãn",
  "View đẹp",
  "Kỷ niệm",
  "Đồ ngọt",
  "Đồ uống",
  "Nghỉ dưỡng",
];

export default function RatingPage({ onSubmit, onRandomPick }: RatingPageProps) {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  const handleScoreChange = (placeId: string, score: number) => {
    setScores((prev) => ({ ...prev, [placeId]: score }));
  };

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      const matchesSearch =
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === "Tất cả" || place.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const ratedCount = Object.values(scores).filter((s) => s > 0).length;

  const handleSubmit = () => {
    const ratings: PlaceRating[] = places.map((place) => ({
      placeId: place.id,
      score: scores[place.id] || 0,
    }));

    const ranked: RankedPlace[] = places
      .map((place) => ({
        ...place,
        score: scores[place.id] || 0,
        rank: 0,
      }))
      .filter((p) => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((p, i) => ({ ...p, rank: i + 1 }));

    onSubmit(ratings, ranked);
  };

  return (
    <motion.div
      className="min-h-screen px-4 sm:px-6 py-8 pb-32 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.5 }}
    >
      {/* Decorative blobs */}
      <div className="fixed top-0 left-0 w-72 h-72 bg-pink-200/30 dark:bg-pink-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-200/20 dark:bg-purple-500/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent">
            Chọn nơi công chúa thích nè! 🌸
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Kéo thanh trượt hoặc bấm vào trái tim để chấm điểm
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          className="relative mb-4"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl glass text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-500 placeholder:text-pink-300/60"
          />
        </motion.div>

        {/* Category filter */}
        <motion.div
          className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${activeCategory === cat
                  ? "bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-md shadow-pink-200/50"
                  : "glass text-pink-500 dark:text-pink-300 hover:bg-pink-100/60 dark:hover:bg-pink-900/20"
                }`}
            >
              {cat === "Tất cả" && <Filter className="w-3 h-3 inline mr-1" />}
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Progress */}
        <motion.div
          className="mb-6 glass rounded-2xl p-3 flex items-center gap-3"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <Heart className="w-4 h-4 text-pink-400 fill-pink-400 shrink-0" />
          <div className="flex-1">
            <div className="h-2 rounded-full bg-pink-100 dark:bg-pink-900/30 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-pink-400 to-rose-400"
                animate={{ width: `${(ratedCount / places.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          <span className="text-xs font-semibold text-pink-500 dark:text-pink-300 shrink-0">
            {ratedCount}/{places.length}
          </span>
        </motion.div>

        {/* Places grid */}
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredPlaces.map((place, index) => (
              <PlaceCard
                key={place.id}
                place={place}
                score={scores[place.id] || 0}
                onScoreChange={(score) => handleScoreChange(place.id, score)}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredPlaces.length === 0 && (
          <motion.div
            className="text-center py-12 text-pink-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-4xl mb-2">🔍</p>
            <p className="text-sm">Không tìm thấy kết quả nào...</p>
          </motion.div>
        )}
      </div>

      {/* Fixed bottom buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 z-40">
        <div className="max-w-2xl mx-auto flex gap-2">
          {/* Random pick button - always visible */}
          <motion.button
            onClick={onRandomPick}
            className="shrink-0 py-4 px-4 rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 text-white font-bold text-base shadow-xl shadow-purple-300/30 dark:shadow-purple-500/15 flex items-center justify-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <Dice6 className="w-5 h-5" />
            <span className="hidden sm:inline">Ngẫu nhiên</span>
            <span className="sm:hidden">🎲</span>
          </motion.button>

          {/* Submit button */}
          <AnimatePresence>
            {ratedCount > 0 ? (
              <motion.button
                onClick={handleSubmit}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white font-bold text-base shadow-xl shadow-pink-300/40 dark:shadow-pink-500/20 flex items-center justify-center gap-2 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                Xem kết quả
                <ArrowRight className="w-5 h-5" />
                <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {ratedCount} đã chọn
                </span>
              </motion.button>
            ) : (
              <motion.div
                className="flex-1 py-4 rounded-2xl glass text-pink-400 dark:text-pink-300 font-medium text-sm flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Heart className="w-4 h-4 fill-pink-300" />
                Chấm điểm hoặc chọn ngẫu nhiên nhé!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
