"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { PlaceRating, RankedPlace, AppStep } from "@/types";
import FloatingHearts from "@/components/FloatingHearts";
import LoadingScreen from "@/components/LoadingScreen";
import LandingPage from "@/components/LandingPage";
import RatingPage from "@/components/RatingPage";
import ResultsPage from "@/components/ResultsPage";

export default function HomePage() {
  const [step, setStep] = useState<AppStep>("landing");
  const [isLoading, setIsLoading] = useState(true);
  const [ratings, setRatings] = useState<PlaceRating[]>([]);
  const [topPlaces, setTopPlaces] = useState<RankedPlace[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    setStep("rating");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (newRatings: PlaceRating[], newTopPlaces: RankedPlace[]) => {
    setRatings(newRatings);
    setTopPlaces(newTopPlaces);
    setStep("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRestart = () => {
    setRatings([]);
    setTopPlaces([]);
    setStep("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-50 via-rose-50/50 to-purple-50/30 dark:from-[#1a0a1e] dark:via-[#1f0f28] dark:to-[#160a1a]">
      <FloatingHearts />

      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loading" />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isLoading && step === "landing" && (
          <LandingPage key="landing" onStart={handleStart} />
        )}
        {!isLoading && step === "rating" && (
          <RatingPage key="rating" onSubmit={handleSubmit} />
        )}
        {!isLoading && step === "results" && (
          <ResultsPage
            key="results"
            topPlaces={topPlaces}
            ratings={ratings}
            onRestart={handleRestart}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
