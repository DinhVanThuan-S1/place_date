"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Place } from "@/types";
import confetti from "canvas-confetti";
import {
  Dice6,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Send,
  Check,
  AlertCircle,
  Heart,
} from "lucide-react";

interface RandomResultsPageProps {
  places: Place[];
  onReroll: () => void;
  onBack: () => void;
  onGoRating: () => void;
}

export default function RandomResultsPage({
  places,
  onReroll,
  onBack,
  onGoRating,
}: RandomResultsPageProps) {
  const confettiRef = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const [revealIndex, setRevealIndex] = useState(-1);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Reset state when places change (reroll)
  useEffect(() => {
    confettiRef.current = false;
    setRevealed(false);
    setRevealIndex(-1);
    setSubmitStatus("idle");
    setErrorMessage("");

    const timers: NodeJS.Timeout[] = [];
    timers.push(setTimeout(() => setRevealIndex(0), 600));
    timers.push(setTimeout(() => setRevealIndex(1), 1200));
    timers.push(
      setTimeout(() => {
        setRevealIndex(2);
        setRevealed(true);
      }, 1800)
    );

    return () => timers.forEach(clearTimeout);
  }, [places]);

  useEffect(() => {
    if (revealed && !confettiRef.current) {
      confettiRef.current = true;
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: [
          "#f472b6",
          "#ec4899",
          "#f9a8d4",
          "#fce7f3",
          "#fda4af",
          "#a855f7",
        ],
      });
    }
  }, [revealed]);

  const handleSubmitToTelegram = async () => {
    setSubmitStatus("loading");
    setErrorMessage("");

    try {
      // Build top places as RankedPlace format for the API
      const topPlaces = places.map((place, index) => ({
        ...place,
        score: 10 - index, // Give descending scores for display
        rank: index + 1,
      }));

      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ratings: [],
          topPlaces,
          submittedAt: new Date().toISOString(),
          isRandom: true,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus("success");
      } else {
        setSubmitStatus("error");
        setErrorMessage(data.error || "Gửi thất bại, thử lại sau nhé!");
      }
    } catch {
      setSubmitStatus("error");
      setErrorMessage("Không thể kết nối, kiểm tra lại mạng nhé!");
    }
  };

  const rankLabels = [
    {
      emoji: "🥇",
      label: "Lựa chọn số 1",
      color: "from-amber-300/30 via-yellow-200/20 to-amber-100/10",
    },
    {
      emoji: "🥈",
      label: "Lựa chọn số 2",
      color: "from-slate-300/20 via-slate-200/10 to-slate-100/5",
    },
    {
      emoji: "🥉",
      label: "Lựa chọn số 3",
      color: "from-orange-300/20 via-orange-200/10 to-orange-100/5",
    },
  ];

  return (
    <motion.div
      className="min-h-screen px-4 sm:px-6 py-8 pb-12 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Decorative blobs */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-purple-200/20 dark:bg-purple-500/5 rounded-full blur-3xl" />
      <div className="fixed bottom-10 right-10 w-80 h-80 bg-pink-200/30 dark:bg-pink-500/5 rounded-full blur-3xl" />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="inline-block mb-4"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="text-5xl">🎲</span>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-500 via-pink-400 to-rose-400 bg-clip-text text-transparent">
            Số phận đã chọn! ✨
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            3 địa điểm được chọn ngẫu nhiên cho buổi hẹn hò
          </p>
        </motion.div>

        {/* Results cards */}
        <div className="space-y-5">
          <AnimatePresence>
            {places.map((place, index) => (
              <motion.div
                key={`${place.id}-${index}`}
                className={`glass rounded-3xl relative overflow-hidden ${
                  revealIndex >= index ? "opacity-100" : "opacity-0"
                }`}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={
                  revealIndex >= index
                    ? { opacity: 1, scale: 1, y: 0 }
                    : { opacity: 0, scale: 0.8, y: 30 }
                }
                transition={{
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
              >
                {/* Gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${rankLabels[index].color}`}
                />

                <div className="relative z-10 p-5 sm:p-6">
                  <div className="flex items-center gap-4">
                    {/* Rank badge */}
                    <motion.div
                      className="flex flex-col items-center gap-1"
                      initial={{ rotate: -180, scale: 0 }}
                      animate={
                        revealIndex >= index
                          ? { rotate: 0, scale: 1 }
                          : { rotate: -180, scale: 0 }
                      }
                      transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      <span className="text-3xl">
                        {rankLabels[index].emoji}
                      </span>
                    </motion.div>

                    {/* Emoji */}
                    <motion.span
                      className="text-4xl sm:text-5xl"
                      animate={
                        revealIndex >= index ? { scale: [0, 1.2, 1] } : {}
                      }
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      {place.emoji}
                    </motion.span>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg sm:text-xl text-foreground">
                        {place.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {place.description}
                      </p>
                      <span className="inline-block mt-2 text-[11px] px-2.5 py-0.5 rounded-full bg-pink-100/80 dark:bg-pink-900/30 text-pink-500 dark:text-pink-300 font-medium">
                        {rankLabels[index].label}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Placeholder cards before reveal */}
        {revealIndex < 2 && (
          <div className="mt-5 space-y-5">
            {Array.from({ length: 2 - revealIndex }, (_, i) => (
              <motion.div
                key={`placeholder-${i}`}
                className="glass rounded-3xl p-6 flex items-center justify-center gap-3"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [0.98, 1, 0.98],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Sparkles className="w-5 h-5 text-pink-300" />
                <span className="text-sm text-pink-300 font-medium">
                  Đang bốc thăm...
                </span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              className="mt-10 space-y-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {/* Submit to Telegram - "Chốt kèo" */}
              <motion.button
                onClick={handleSubmitToTelegram}
                disabled={
                  submitStatus === "loading" || submitStatus === "success"
                }
                className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                  submitStatus === "success"
                    ? "bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-lg shadow-green-200/50"
                    : submitStatus === "error"
                    ? "bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg shadow-pink-200/50"
                    : "bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white shadow-lg shadow-pink-300/40 dark:shadow-pink-500/20"
                } disabled:opacity-70`}
                whileHover={
                  submitStatus !== "success" ? { scale: 1.02 } : {}
                }
                whileTap={
                  submitStatus !== "success" ? { scale: 0.98 } : {}
                }
              >
                {submitStatus === "idle" && (
                  <>
                    <Send className="w-5 h-5" />
                    Chốt kèo đi thôi 💖
                  </>
                )}
                {submitStatus === "loading" && (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Heart className="w-5 h-5 fill-white" />
                    </motion.div>
                    Đang gửi cho anh...
                  </>
                )}
                {submitStatus === "success" && (
                  <>
                    <Check className="w-5 h-5" />
                    Đã gửi rồi nè! 🎉
                  </>
                )}
                {submitStatus === "error" && (
                  <>
                    <AlertCircle className="w-5 h-5" />
                    Thử lại nhé
                  </>
                )}
              </motion.button>

              {submitStatus === "error" && errorMessage && (
                <motion.p
                  className="text-center text-xs text-rose-400"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errorMessage}
                </motion.p>
              )}

              {submitStatus === "success" && (
                <motion.p
                  className="text-center text-xs text-green-500 dark:text-green-400"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Anh đã nhận được kết quả rồi, cảm ơn bé yêu! 🥰
                </motion.p>
              )}

              {/* Reroll button */}
              <motion.button
                onClick={onReroll}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 text-white font-bold text-base shadow-lg shadow-purple-300/30 dark:shadow-purple-500/15 flex items-center justify-center gap-2 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Dice6 className="w-5 h-5" />
                Quay lại lần nữa! 🎲
              </motion.button>

              {/* Navigation buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onBack}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-2xl glass text-pink-500 dark:text-pink-300 font-medium text-sm hover:bg-pink-100/50 dark:hover:bg-pink-900/20 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Về trang chủ
                </button>
                <button
                  onClick={onGoRating}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-2xl glass text-pink-500 dark:text-pink-300 font-medium text-sm hover:bg-pink-100/50 dark:hover:bg-pink-900/20 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Tự chấm điểm
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <p className="text-sm text-pink-300/60 dark:text-pink-500/40">
            Made with 💕 for you
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
