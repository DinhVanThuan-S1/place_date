"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { PlaceRating, RankedPlace, AppStep, Place } from "@/types";
import { places } from "@/data/places";
import { weightedRandomPick } from "@/lib/random";
import FloatingHearts from "@/components/FloatingHearts";
import LoadingScreen from "@/components/LoadingScreen";
import LandingPage from "@/components/LandingPage";
import RatingPage from "@/components/RatingPage";
import ResultsPage from "@/components/ResultsPage";
import RandomResultsPage from "@/components/RandomResultsPage";

const BOOSTED_IDS = ["homestay", "box-game"];

export default function HomePage() {
  const [step, setStep] = useState<AppStep>("landing");
  const [isLoading, setIsLoading] = useState(true);
  const [ratings, setRatings] = useState<PlaceRating[]>([]);
  const [topPlaces, setTopPlaces] = useState<RankedPlace[]>([]);
  const [randomPlaces, setRandomPlaces] = useState<Place[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    setStep("rating");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRandomPick = useCallback(() => {
    const picked = weightedRandomPick(places, 3, BOOSTED_IDS, 15);
    setRandomPlaces(picked);
    setStep("random-results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleReroll = useCallback(() => {
    const picked = weightedRandomPick(places, 3, BOOSTED_IDS, 15);
    setRandomPlaces(picked);
  }, []);

  const handleGoRating = () => {
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
    setRandomPlaces([]);
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
          <RatingPage
            key="rating"
            onSubmit={handleSubmit}
            onRandomPick={handleRandomPick}
          />
        )}
        {!isLoading && step === "results" && (
          <ResultsPage
            key="results"
            topPlaces={topPlaces}
            ratings={ratings}
            onRestart={handleRestart}
          />
        )}
        {!isLoading && step === "random-results" && (
          <RandomResultsPage
            key="random-results"
            places={randomPlaces}
            onReroll={handleReroll}
            onBack={handleRestart}
            onGoRating={handleGoRating}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
