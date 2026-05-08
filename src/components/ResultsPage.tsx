"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { RankedPlace, PlaceRating } from "@/types";
import confetti from "canvas-confetti";
import { Crown, Heart, Sparkles, Star, Send, Check, AlertCircle, RotateCcw } from "lucide-react";

interface ResultsPageProps {
  topPlaces: RankedPlace[];
  ratings: PlaceRating[];
  onRestart: () => void;
}

const rankConfig: Record<number, { icon: React.ReactNode; badge: string; gradient: string }> = {
  1: {
    icon: <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" />,
    badge: "👑 Top 1",
    gradient: "from-yellow-300/30 via-amber-200/20 to-yellow-100/10",
  },
  2: {
    icon: <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />,
    badge: "💖 Top 2",
    gradient: "from-pink-300/20 via-rose-200/10 to-pink-100/5",
  },
  3: {
    icon: <Sparkles className="w-5 h-5 text-purple-400 fill-purple-400" />,
    badge: "✨ Top 3",
    gradient: "from-purple-300/20 via-purple-200/10 to-purple-100/5",
  },
};

export default function ResultsPage({ topPlaces, ratings, onRestart }: ResultsPageProps) {
  const confettiRef = useRef(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!confettiRef.current) {
      confettiRef.current = true;
      // Fire confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ["#f472b6", "#ec4899", "#f9a8d4", "#fce7f3", "#fda4af"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ["#f472b6", "#ec4899", "#f9a8d4", "#fce7f3", "#fda4af"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, []);

  const handleSubmitToTelegram = async () => {
    setSubmitStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ratings,
          topPlaces,
          submittedAt: new Date().toISOString(),
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

  return (
    <motion.div
      className="min-h-screen px-4 sm:px-6 py-8 pb-12 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Decorative blobs */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-yellow-200/20 dark:bg-yellow-500/5 rounded-full blur-3xl" />
      <div className="fixed bottom-10 right-10 w-80 h-80 bg-pink-200/30 dark:bg-pink-500/5 rounded-full blur-3xl" />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="inline-block mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-5xl">🎉</span>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 bg-clip-text text-transparent">
            Kết quả đây rồi nè! 💕
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Top {topPlaces.length} địa điểm công chúa yêu thích nhất
          </p>
        </motion.div>

        {/* Results list */}
        <div className="space-y-4">
          {topPlaces.map((place, index) => {
            const config = rankConfig[place.rank];
            const isTopThree = place.rank <= 3;

            return (
              <motion.div
                key={place.id}
                className={`glass rounded-3xl p-5 sm:p-6 relative overflow-hidden ${isTopThree ? "ring-1 ring-pink-200/50 dark:ring-pink-500/20" : ""
                  }`}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.6,
                  ease: "easeOut",
                }}
              >
                {/* Gradient background for top 3 */}
                {isTopThree && config && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${config.gradient}`}
                  />
                )}

                <div className="relative z-10 flex items-center gap-4">
                  {/* Rank number */}
                  <div className="flex flex-col items-center gap-1">
                    {isTopThree && config ? (
                      <motion.div
                        animate={place.rank === 1 ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        {config.icon}
                      </motion.div>
                    ) : (
                      <Star className="w-4 h-4 text-pink-300 fill-pink-300" />
                    )}
                    <span
                      className={`text-xs font-bold ${isTopThree ? "text-pink-500 dark:text-pink-300" : "text-pink-300"
                        }`}
                    >
                      #{place.rank}
                    </span>
                  </div>

                  {/* Emoji */}
                  <motion.span
                    className="text-3xl sm:text-4xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                  >
                    {place.emoji}
                  </motion.span>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base sm:text-lg text-foreground truncate">
                        {place.name}
                      </h3>
                      {isTopThree && config && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-semibold shrink-0">
                          {config.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {place.description}
                    </p>
                  </div>

                  {/* Score */}
                  <motion.div
                    className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-base shadow-md shadow-pink-200/50 shrink-0"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.4, type: "spring" }}
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    {place.score}
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* No results */}
        {topPlaces.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-4xl mb-3">😅</p>
            <p className="text-pink-400 font-medium">
              Công chúa chưa chọn gì hết á, quay lại chọn đi nè!
            </p>
          </motion.div>
        )}

        {/* Submit to Telegram */}
        {topPlaces.length > 0 && (
          <motion.div
            className="mt-8 space-y-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: topPlaces.length * 0.1 + 0.5, duration: 0.6 }}
          >
            <motion.button
              onClick={handleSubmitToTelegram}
              disabled={submitStatus === "loading" || submitStatus === "success"}
              className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${submitStatus === "success"
                  ? "bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-lg shadow-green-200/50"
                  : submitStatus === "error"
                    ? "bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg shadow-pink-200/50"
                    : "bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white shadow-lg shadow-pink-300/40 dark:shadow-pink-500/20"
                } disabled:opacity-70`}
              whileHover={submitStatus !== "success" ? { scale: 1.02 } : {}}
              whileTap={submitStatus !== "success" ? { scale: 0.98 } : {}}
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
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
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
                Anh đã nhận được kết quả rồi, cảm ơn công chúa yêu! 🥰
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Restart button */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: topPlaces.length * 0.1 + 0.8 }}
        >
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass text-pink-500 dark:text-pink-300 font-medium text-sm hover:bg-pink-100/50 dark:hover:bg-pink-900/20 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Chọn lại từ đầu
          </button>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <p className="text-sm text-pink-300/60 dark:text-pink-500/40">
            Made with 💕 for you
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
