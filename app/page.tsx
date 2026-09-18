"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  Sprout,
  ScanLine,
  FlaskConical,
  Trees,
  CloudSun,
  Building2,
  Satellite,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Award,
  Volume2,
  Sparkles,
  MapPin,
} from "lucide-react";

export default function HomePage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);

  // Audio voice simulation for farmer testimonials
  const playVoiceSnippet = (text: string, voiceId: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (language === "hi") utterance.lang = "hi-IN";
      else if (language === "pa") utterance.lang = "pa-IN";
      else utterance.lang = "en-IN";
      utterance.rate = 0.95;

      setPlayingVoice(voiceId);
      utterance.onend = () => setPlayingVoice(null);
      utterance.onerror = () => setPlayingVoice(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  const featureCards = [
    {
      icon: Satellite,
      title: "Satellite Crop Advisory",
      subtitle: "Google Earth Engine Sentinel-2 NDVI remote sensing to track vegetation vigour, moisture stress, and canopy density without sensors.",
      color: "emerald",
      badge: "Real-time GEE",
    },
    {
      icon: ScanLine,
      title: "AI Disease Detection",
      subtitle: "On-device TensorFlow.js MobileNet model identifying 62+ fungal, bacterial, and viral diseases across 15+ crops with organic & chemical cures.",
      color: "amber",
      badge: "62+ Pathogens",
    },
    {
      icon: FlaskConical,
      title: "Soil NPK Optimization",
      subtitle: "Algorithmic N-P-K fertilizer ratio calculations customized to soil pH, district conditions, and seasonal nutrient uptake curves.",
      color: "blue",
      badge: "Precise Dosage",
    },
    {
      icon: CloudSun,
      title: "Hyperlocal Micro-Weather",
      subtitle: "7-day agro-meteorological forecasting with localized spraying suitability indices, humidity warnings, and precipitation windows.",
      color: "sky",
      badge: "Spray Windows",
    },
    {
      icon: Trees,
      title: "Regenerative Carbon Planner",
      subtitle: "Soil organic carbon enhancement roadmap, multi-year crop rotations, and carbon credit monetization estimates up to ₹3,500/acre.",
      color: "emerald",
      badge: "Carbon Credits",
    },
    {
      icon: Building2,
      title: "State Collaboration Portal",
      subtitle: "India Digital Ecosystem for Agriculture (IDEA) / Agristack JSON-LD compliance with OAuth 2.0 API gateway for state departments.",
      color: "purple",
      badge: "Agristack IDEA",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Map Plot & Soil Profile",
      desc: "Plot your farm boundaries on our interactive Leaflet satellite map and enter your baseline soil NPK laboratory values.",
    },
    {
      step: "02",
      title: "Continuous Field Intelligence",
      desc: "Scan troubled leaves via your smartphone camera for instant pathology diagnosis and receive automated Sentinel-2 NDVI updates.",
    },
    {
      step: "03",
      title: "Harvest & Carbon Dividends",
      desc: "Apply balanced micronutrients, execute spray advisories during optimal meteorological windows, and earn carbon incentives.",
    },
  ];

  const testimonials = [
    {
      id: "gurvinder",
      name: "Sardar Gurvinder Singh",
      location: "Ludhiana, Punjab",
      crops: "Wheat & Mustard (4.8 Acres)",
      quote: "KrishiBuddy's early yellow rust detection alert saved 35% of my Rabi wheat crop. The Punjabi voice guidance makes it as simple as talking to an agricultural officer.",
      audioText: "ਕ੍ਰਿਸ਼ੀ ਬੱਡੀ ਦੀ ਪੀਲੀ ਕੁੰਗੀ ਦੀ ਚੇਤਾਵਨੀ ਨੇ ਮੇਰੀ ਕਣਕ ਦੀ ਫ਼ਸਲ ਬਚਾ ਲਈ। ਇਹ ਬਹੁਤ ਸੌਖਾ ਅਤੇ ਫ਼ਾਇਦੇਮੰਦ ਹੈ।",
      avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=120&auto=format&fit=crop&q=80",
    },
    {
      id: "rajesh",
      name: "Rajesh Patil",
      location: "Nashik, Maharashtra",
      crops: "Tomato & Table Grapes (3.2 Acres)",
      quote: "The NPK fertilizer recommendation cut down my DAP expenses by ₹4,200 per acre while keeping tomato foliage disease-free under heavy monsoon humidity.",
      audioText: "कृषि बडी के सटीक खाद सुझाव से मेरे खर्च में भारी बचत हुई और टमाटर की फसल स्वस्थ रही।",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    },
    {
      id: "sunita",
      name: "Sunita Bai",
      location: "Sehore, Madhya Pradesh",
      crops: "Soybean & Gram (5 Acres)",
      quote: "The weather spray window indicator told me exactly when not to spray pesticide before unexpected rain. It prevented my entire spray from washing away.",
      audioText: "मौसम की सही जानकारी से मेरी दवा की बर्बादी रुक गई। यह हर किसान के लिए उपयोगी है।",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
    },
  ];

  const partners = [
    "ICAR - Indian Council of Agricultural Research",
    "Digital India Initiative",
    "Google Earth Engine Remote Sensing",
    "Dept of Agriculture & Farmers Welfare (DA&FW)",
    "Agristack / IDEA Framework",
    "National Remote Sensing Centre (ISRO/NRSC)",
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#040d0a] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden agri-gradient-hero">
          {/* Subtle decorative circles */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-6 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>Interoperable Agristack Digital Agriculture Network</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                AI-Powered Agriculture for <span className="gradient-text">Small Farmers</span>
              </h1>

              {/* Subtitle */}
              <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Equipping 140 million Indian smallholders with satellite crop health monitoring, on-device TensorFlow.js
                leaf pathology diagnosis, precision NPK soil advisories, and regenerative carbon credits.
              </p>

              {/* CTA Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={user ? "/dashboard" : "/auth"}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <span>{user ? "Open Farmer Dashboard" : t("getStarted")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/disease-scan"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl glass-panel hover:bg-slate-100 dark:hover:bg-emerald-950/40 text-slate-800 dark:text-slate-100 text-sm font-semibold border border-slate-300 dark:border-emerald-900/60 transition-all flex items-center justify-center gap-2"
                >
                  <ScanLine className="w-4 h-4 text-emerald-500" />
                  <span>Try Disease Scanner</span>
                </Link>
              </div>

              {/* Key Metrics Strip */}
              <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-200/80 dark:border-emerald-950/60">
                <div className="p-3">
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">62+</p>
                  <p className="text-xs text-slate-500 mt-0.5">Diagnosed Leaf Diseases</p>
                </div>
                <div className="p-3">
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">10-Day</p>
                  <p className="text-xs text-slate-500 mt-0.5">Sentinel-2 Satellite Revisit</p>
                </div>
                <div className="p-3">
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">₹4,200/Ac</p>
                  <p className="text-xs text-slate-500 mt-0.5">Average Fertilizer Savings</p>
                </div>
                <div className="p-3">
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">3 Languages</p>
                  <p className="text-xs text-slate-500 mt-0.5">Hindi, Punjabi & English</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PARTNERSHIP TICKER */}
        <section className="border-y border-slate-200/80 dark:border-emerald-950/60 bg-white/50 dark:bg-[#030a07]/60 py-6 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-4">
              Integrated with Indian Agricultural Institutions & Digital Rails
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-xs font-medium text-slate-600 dark:text-slate-400">
              {partners.map((partner, index) => (
                <div key={index} className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{partner}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6 CORE FEATURES GRID */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
              Comprehensive Platform Capabilities
            </h2>
            <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              End-to-End Intelligence from Seed to Harvest
            </h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Built on open data standards with interoperability across state agricultural registries and KVK extensions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="glass-card p-6 rounded-2xl flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-emerald-950/60 text-slate-700 dark:text-emerald-300 font-medium border border-slate-200 dark:border-emerald-900/60">
                        {feat.badge}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-500 transition-colors">
                      {feat.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feat.subtitle}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                    <span>Explore module</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3-STEP PROCESS */}
        <section className="py-20 bg-slate-100/70 dark:bg-[#030b08]/80 border-y border-slate-200/80 dark:border-emerald-950/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                How It Works
              </h2>
              <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Three Simple Steps for Indian Smallholders
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Designed for field use on smartphones with offline caching and regional audio synthesis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {steps.map((st, i) => (
                <div key={i} className="glass-panel p-6 rounded-2xl relative">
                  <span className="text-4xl font-extrabold text-emerald-600/20 dark:text-emerald-500/20 mb-3 block">
                    {st.step}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">{st.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{st.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FARMER TESTIMONIALS */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
              Verified Farmer Voices
            </h2>
            <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Real Impacts Across Punjab, Maharashtra & MP
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test) => (
              <div key={test.id} className="glass-card p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={test.avatar}
                      alt={test.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/40"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{test.name}</h4>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{test.location}</span>
                      </p>
                      <p className="text-[10px] text-slate-400">{test.crops}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                    &ldquo;{test.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => playVoiceSnippet(test.audioText, test.id)}
                    className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                  >
                    <Volume2 className={`w-4 h-4 ${playingVoice === test.id ? "animate-pulse text-amber-500" : ""}`} />
                    <span>{playingVoice === test.id ? "Playing Voice..." : "Hear in Regional Audio"}</span>
                  </button>
                  <span className="text-[10px] text-slate-400">Verified Sathi</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA BANNER */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-900 text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
                Empower Your Fields with Intelligent Agricultural Guidance
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed mb-6">
                Instant access to Sentinel-2 NDVI satellite monitoring, MobileNet crop disease diagnostics, and state-wide
                Agristack interoperability. Free for Indian farmers.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={user ? "/dashboard" : "/auth"}
                  className="px-6 py-3 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold shadow-lg transition-all flex items-center gap-2"
                >
                  <span>{user ? "Go to My Farm Dashboard" : "Start With Free Account"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/state-portal"
                  className="px-5 py-3 rounded-xl border border-white/30 hover:bg-white/10 text-white text-xs font-semibold transition-all"
                >
                  State Department Portal
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
