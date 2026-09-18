"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FarmMap from "@/components/FarmMap";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { dbService, DEMO_FARMS, DEMO_ADVISORIES } from "@/lib/services/db";
import { Farm, Advisory, HyperlocalWeather } from "@/types";
import {
  Sprout,
  ScanLine,
  FlaskConical,
  Trees,
  CloudSun,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Volume2,
  Calendar,
  Clock,
  Download,
  CheckCircle2,
  FileText,
  Activity,
} from "lucide-react";

export default function DashboardPage() {
  const { user, role } = useAuth();
  const { t, language } = useLanguage();

  const [farms, setFarms] = useState<Farm[]>(DEMO_FARMS);
  const [selectedFarm, setSelectedFarm] = useState<Farm>(DEMO_FARMS[0]);
  const [advisories, setAdvisories] = useState<Advisory[]>(DEMO_ADVISORIES);
  const [weatherData, setWeatherData] = useState<HyperlocalWeather | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [speakingAdvisoryId, setSpeakingAdvisoryId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(
    "🌾 Sentinel-2 satellite pass refreshed 3 hours ago: Canopy health is optimal (NDVI 0.78)."
  );

  useEffect(() => {
    async function loadData() {
      if (user) {
        const userFarms = await dbService.getFarms(user.uid);
        if (userFarms.length > 0) {
          setFarms(userFarms);
          setSelectedFarm(userFarms[0]);
        }
        const userAdvisories = await dbService.getAdvisories(user.uid);
        if (userAdvisories.length > 0) {
          setAdvisories(userAdvisories);
        }
      }
    }
    loadData();
  }, [user]);

  // Fetch or synthesize Hyperlocal Weather
  useEffect(() => {
    async function fetchWeather() {
      setLoadingWeather(true);
      try {
        const lat = selectedFarm.location.latitude;
        const lng = selectedFarm.location.longitude;
        const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
        if (res.ok) {
          const data = await res.json();
          setWeatherData(data);
        } else {
          fallbackWeather();
        }
      } catch {
        fallbackWeather();
      } finally {
        setLoadingWeather(false);
      }
    }

    function fallbackWeather() {
      setWeatherData({
        current: {
          temp: 28,
          feelsLike: 30,
          humidity: 58,
          windSpeed: 11,
          windDirection: "NW",
          pressure: 1012,
          uvIndex: 6,
          condition: "Partly Cloudy",
          icon: "partly-cloudy",
          lastUpdated: "Just now",
          sprayWindowStatus: "Optimal for Fungicide Spray",
        },
        forecast: [
          {
            date: "Today",
            dayName: "Fri",
            tempMax: 31,
            tempMin: 19,
            humidity: 55,
            precipitationChance: 10,
            weatherCondition: "Clear Skies",
            icon: "sun",
            agriSpraySuitability: "Optimal",
          },
          {
            date: "Tomorrow",
            dayName: "Sat",
            tempMax: 32,
            tempMin: 20,
            humidity: 60,
            precipitationChance: 15,
            weatherCondition: "Sunny",
            icon: "sun",
            agriSpraySuitability: "Optimal",
          },
          {
            date: "Day 3",
            dayName: "Sun",
            tempMax: 29,
            tempMin: 18,
            humidity: 74,
            precipitationChance: 65,
            weatherCondition: "Scattered Rain",
            icon: "rain",
            agriSpraySuitability: "Avoid",
          },
          {
            date: "Day 4",
            dayName: "Mon",
            tempMax: 27,
            tempMin: 17,
            humidity: 80,
            precipitationChance: 70,
            weatherCondition: "Thunderstorm",
            icon: "rain",
            agriSpraySuitability: "Avoid",
          },
          {
            date: "Day 5",
            dayName: "Tue",
            tempMax: 28,
            tempMin: 18,
            humidity: 62,
            precipitationChance: 25,
            weatherCondition: "Partly Cloudy",
            icon: "partly-cloudy",
            agriSpraySuitability: "Caution",
          },
          {
            date: "Day 6",
            dayName: "Wed",
            tempMax: 30,
            tempMin: 19,
            humidity: 54,
            precipitationChance: 10,
            weatherCondition: "Sunny",
            icon: "sun",
            agriSpraySuitability: "Optimal",
          },
          {
            date: "Day 7",
            dayName: "Thu",
            tempMax: 31,
            tempMin: 20,
            humidity: 50,
            precipitationChance: 5,
            weatherCondition: "Clear",
            icon: "sun",
            agriSpraySuitability: "Optimal",
          },
        ],
        advisory: "Favorable dry conditions today and tomorrow. Complete scheduled foliar weedicide sprays before Sunday rainfall.",
      });
    }

    fetchWeather();
  }, [selectedFarm]);

  // Audio Speech synthesis for advisories
  const speakAdvisory = (text: string, id: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      if (speakingAdvisoryId === id) {
        setSpeakingAdvisoryId(null);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      if (language === "hi") utterance.lang = "hi-IN";
      else if (language === "pa") utterance.lang = "pa-IN";
      else utterance.lang = "en-IN";
      utterance.rate = 0.95;

      setSpeakingAdvisoryId(id);
      utterance.onend = () => setSpeakingAdvisoryId(null);
      utterance.onerror = () => setSpeakingAdvisoryId(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#040d0a] text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Toast Alert Banner */}
        {toastMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-slate-600 text-xs ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t("welcomeBack")}, {user?.name || "Kisan Sathi"}!
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-medium">
                Active Sathi
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Farm Location: {selectedFarm.name} • {selectedFarm.area} Acres • {user?.district || "Ludhiana"},{" "}
              {user?.state || "Punjab"}
            </p>
          </div>

          {/* Farm selector dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-500">Active Farm:</label>
            <select
              value={selectedFarm.id}
              onChange={(e) => {
                const found = farms.find((f) => f.id === e.target.value);
                if (found) setSelectedFarm(found);
              }}
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.area} Ac)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4 QUICK ACTION CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/disease-scan"
            className="glass-card p-5 rounded-2xl flex flex-col justify-between group border-l-4 border-l-amber-500"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <ScanLine className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-amber-500 transition-colors">
                Scan Crop Disease
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Take photo with MobileNet AI for instant diagnosis & bio-treatment.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-amber-600 group-hover:translate-x-1 transition-transform">
              <span>Start Camera Scan</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          <Link
            href="/advisory"
            className="glass-card p-5 rounded-2xl flex flex-col justify-between group border-l-4 border-l-blue-500"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FlaskConical className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-500 transition-colors">
                Get NPK Advisory
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Enter soil test values for Urea, DAP, and MOP schedule recommendation.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
              <span>Optimize Fertilizer</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          <Link
            href="/regenerative"
            className="glass-card p-5 rounded-2xl flex flex-col justify-between group border-l-4 border-l-emerald-500"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Trees className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-emerald-500 transition-colors">
                Regenerative Planner
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Calculate soil organic carbon & estimate carbon credit income.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">
              <span>View Carbon Earnings</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          <Link
            href="/state-portal"
            className="glass-card p-5 rounded-2xl flex flex-col justify-between group border-l-4 border-l-purple-500"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-purple-500 transition-colors">
                Agristack Rails
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Interoperable state data sharing, JSON-LD schemas, and API keys.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-purple-600 group-hover:translate-x-1 transition-transform">
              <span>Access Portal</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>
        </div>

        {/* GRID: FARM MAP & SATELLITE NDVI + SOIL REPORT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Farm Map Col (2/3) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{t("farmBoundary")}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-mono">
                    Sentinel-2
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  Geo-fenced plot boundary in Ludhiana with dynamic NDVI layer overlay
                </p>
              </div>
            </div>

            {/* Leaflet Component */}
            <FarmMap farm={selectedFarm} height="360px" />
          </div>

          {/* SATELLITE NDVI & SOIL HEALTH GAUGE (1/3) */}
          <div className="space-y-4">
            <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-emerald-950/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Satellite NDVI Gauge
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">Normalized Index</span>
                </div>

                {/* Circular / Bar Gauge */}
                <div className="my-3 flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-full border-4 border-emerald-500/20 flex items-center justify-center">
                    <div
                      className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent"
                      style={{ transform: "rotate(45deg)" }}
                    />
                    <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                      {selectedFarm.ndviScore || 0.78}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Vigorous Vegetation
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Canopy chlorophyll density is in the 88th percentile for Rabi Wheat in Punjab.
                    </p>
                  </div>
                </div>

                {/* Soil Health Matrix */}
                <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                  <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Soil Nutrients (kg/ha)
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <p className="text-[10px] text-slate-400">Nitrogen (N)</p>
                      <p className="font-bold text-emerald-600">{selectedFarm.soilHealth?.nitrogen || 245}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <p className="text-[10px] text-slate-400">Phosphorus (P)</p>
                      <p className="font-bold text-amber-600">{selectedFarm.soilHealth?.phosphorus || 48}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <p className="text-[10px] text-slate-400">Potassium (K)</p>
                      <p className="font-bold text-blue-600">{selectedFarm.soilHealth?.potassium || 195}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>pH Level: <b>{selectedFarm.soilHealth?.ph || 7.2} (Neutral)</b></span>
                    <span>Organic Carbon: <b>{selectedFarm.soilHealth?.organicCarbon || 0.68}%</b></span>
                  </div>
                </div>
              </div>

              <Link
                href="/advisory"
                className="mt-4 w-full py-2 rounded-xl text-center text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition-colors"
              >
                Recalibrate Soil NPK
              </Link>
            </div>
          </div>
        </div>

        {/* HYPERLOCAL 7-DAY WEATHER FORECAST WIDGET */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 dark:border-emerald-950/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-amber-500" />
                <span>{t("weatherForecast")}</span>
              </h2>
              <p className="text-xs text-slate-500">
                High-resolution agro-meteorological forecast with chemical spraying suitability indicators
              </p>
            </div>

            {weatherData?.current && (
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span>Humidity: {weatherData.current.humidity}%</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <Wind className="w-4 h-4 text-teal-500" />
                  <span>Wind: {weatherData.current.windSpeed} km/h {weatherData.current.windDirection}</span>
                </div>
              </div>
            )}
          </div>

          {/* Spray Window Banner */}
          {weatherData && (
            <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    Spray Window: {weatherData.current.sprayWindowStatus}
                  </span>
                  <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400 mt-0.5">
                    {weatherData.advisory}
                  </p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-1 rounded bg-emerald-600 text-white font-semibold">
                Approved
              </span>
            </div>
          )}

          {/* 7-Day Day Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {weatherData?.forecast.map((day, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{day.dayName}</p>
                  <p className="text-[10px] text-slate-400">{day.date}</p>
                </div>

                <div className="my-2">
                  {day.icon === "rain" ? (
                    <CloudRain className="w-7 h-7 text-blue-500" />
                  ) : day.icon === "sun" ? (
                    <Sun className="w-7 h-7 text-amber-500" />
                  ) : (
                    <CloudSun className="w-7 h-7 text-emerald-500" />
                  )}
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {day.tempMax}° / {day.tempMin}°
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{day.precipitationChance}% Rain</p>
                </div>

                {/* Spray tag */}
                <span
                  className={`mt-2 text-[9px] px-1.5 py-0.5 rounded font-medium ${
                    day.agriSpraySuitability === "Optimal"
                      ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                      : day.agriSpraySuitability === "Caution"
                      ? "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                      : "bg-red-500/20 text-red-700 dark:text-red-300"
                  }`}
                >
                  {day.agriSpraySuitability}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ADVISORIES FEED */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{t("recentAdvisories")}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                  {advisories.length} Active
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Actionable agronomic prescriptions computed from your farm telemetry & pathology scans
              </p>
            </div>

            <Link
              href="/advisory"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Create New Advisory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {advisories.map((adv) => (
              <div
                key={adv.id}
                className="glass-card p-5 rounded-2xl flex flex-col justify-between border border-slate-200/80 dark:border-emerald-950/60"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        adv.type === "crop"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : adv.type === "weather"
                          ? "bg-blue-500/10 text-blue-600"
                          : "bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      {adv.type} Advisory
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {adv.confidence}% match
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                    {adv.title || "Field Nutrient Advisory"}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                    {adv.recommendation}
                  </p>

                  {adv.fertilizerPlan && (
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs mb-3 space-y-1">
                      <p className="font-semibold text-emerald-600 text-[11px]">Calculated Fertilizer Mix:</p>
                      <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400">
                        <span>Urea: {adv.fertilizerPlan.ureaKgPerAcre} kg/ac</span>
                        <span>MOP: {adv.fertilizerPlan.mopKgPerAcre} kg/ac</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => speakAdvisory(adv.recommendation, adv.id)}
                    className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                  >
                    <Volume2
                      className={`w-4 h-4 ${
                        speakingAdvisoryId === adv.id ? "animate-pulse text-amber-500" : ""
                      }`}
                    />
                    <span>{speakingAdvisoryId === adv.id ? "Speaking..." : "Listen"}</span>
                  </button>

                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(adv.createdAt).toLocaleDateString()}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
