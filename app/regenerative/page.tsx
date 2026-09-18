"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  Trees,
  Sprout,
  ShieldCheck,
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Leaf,
  Layers,
  HelpCircle,
} from "lucide-react";

export default function RegenerativePage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Inputs for calculation
  const [farmAcres, setFarmAcres] = useState<number>(4.8);
  const [currentSoc, setCurrentSoc] = useState<number>(0.68); // Soil Organic Carbon %
  const [targetSoc, setTargetSoc] = useState<number>(1.2);
  const [practices, setPractices] = useState<{ [key: string]: boolean }>({
    noTill: true,
    coverCropping: true,
    cropResidueIncorporation: true,
    biocharApplication: false,
    vermicompost: true,
    agroforestryBorders: true,
  });

  const togglePractice = (key: string) => {
    setPractices((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Carbon Credit & Income Math
  const activeCount = Object.values(practices).filter(Boolean).length;
  const soilHealthIndex = Math.min(100, Math.round(currentSoc * 50 + activeCount * 8));
  const carbonTonsPerAcre = Number((0.85 + activeCount * 0.32 + (targetSoc - currentSoc) * 0.8).toFixed(2));
  const totalCarbonTons = Number((carbonTonsPerAcre * farmAcres).toFixed(1));
  const ratePerCreditINR = 1450; // Voluntary market benchmark (Verra / Gold Standard in INR)
  const annualCarbonIncomeINR = Math.round(totalCarbonTons * ratePerCreditINR);

  const rotations = [
    {
      season: "Year 1 (Rabi)",
      crop: "Wheat (PBW 824) + Mustard Intercrop",
      benefit: "Deep root soil aeration + natural pest disruption",
      nitrogenFixation: "Moderate",
    },
    {
      season: "Year 1 (Summer/Zaid)",
      crop: "Green Gram (Moong - SML 668)",
      benefit: "Fixes 38 kg N/ha; increases microbial biomass before monsoon",
      nitrogenFixation: "High (Legume)",
    },
    {
      season: "Year 1 (Kharif)",
      crop: "Direct Seeded Rice (PR 126)",
      benefit: "Saves 25% irrigation water compared to puddled transplant",
      nitrogenFixation: "Baseline",
    },
    {
      season: "Year 2 (Rabi)",
      crop: "Chickpea (Gram) + Linseed",
      benefit: "Breaks monoculture disease cycle; builds mycorrhizal fungi",
      nitrogenFixation: "High (Legume)",
    },
  ];

  const governmentSchemes = [
    {
      name: "PM-PRANAM Scheme",
      ministry: "Ministry of Chemicals & Fertilizers",
      incentive: "50% subsidy savings credited to state & farmers for chemical fertilizer reduction.",
      eligibility: "Eligible (Active bio-fertilizer usage confirmed)",
    },
    {
      name: "Paramparagat Krishi Vikas Yojana (PKVY)",
      ministry: "Department of Agriculture & Farmers Welfare",
      incentive: "₹50,000 per hectare over 3 years for organic conversion & certification.",
      eligibility: "Eligible (Meets residue-free baseline criteria)",
    },
    {
      name: "Sub-Mission on Agroforestry (SMA)",
      ministry: "National Agroforestry Policy",
      incentive: "₹70 per tree sapling for boundary planting + carbon verification support.",
      eligibility: "Eligible (Farm boundary hedgerow registered)",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#040d0a] text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Trees className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t("regenerative")} & Carbon Credits
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-mono">
                Verra VM0042 Aligned
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Maximize soil organic carbon (SOC), restore natural rhizosphere biology, and unlock carbon credit monetization for your farm.
            </p>
          </div>
        </div>

        {/* TOP METRICS SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-2xl border-l-4 border-l-emerald-500">
            <span className="text-[11px] uppercase font-bold text-slate-400">Soil Health Index</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {soilHealthIndex}/100
              </span>
              <span className="text-xs text-emerald-600 font-semibold">Resilient</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Based on SOC & biological practices</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border-l-4 border-l-teal-500">
            <span className="text-[11px] uppercase font-bold text-slate-400">Estimated Carbon Yield</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {totalCarbonTons}
              </span>
              <span className="text-xs text-slate-500 font-medium">tCO2e / Year</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">{carbonTonsPerAcre} tons/acre across {farmAcres} acres</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border-l-4 border-l-amber-500">
            <span className="text-[11px] uppercase font-bold text-slate-400">Estimated Carbon Dividend</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                ₹{annualCarbonIncomeINR.toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-slate-500 font-medium">/ year</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">At ₹{ratePerCreditINR}/tCO2e market rate</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border-l-4 border-l-blue-500">
            <span className="text-[11px] uppercase font-bold text-slate-400">Subsidy Schemes</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">3 Verified</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">PM-PRANAM, PKVY, Agroforestry</p>
          </div>
        </div>

        {/* 2-COLUMN SECTION: SIMULATOR & PRACTICES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Farm Settings & Regenerative Checklist (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 dark:border-emerald-950/60 shadow-lg space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                1. Farm Carbon Parameters
              </h2>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Farm Area</span>
                  <span className="text-emerald-600 font-mono">{farmAcres} Acres</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={25}
                  step={0.5}
                  value={farmAcres}
                  onChange={(e) => setFarmAcres(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Current Soil Organic Carbon (SOC)</span>
                  <span className="text-emerald-600 font-mono">{currentSoc}%</span>
                </div>
                <input
                  type="range"
                  min={0.3}
                  max={2.0}
                  step={0.05}
                  value={currentSoc}
                  onChange={(e) => setCurrentSoc(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>3-Year Target SOC</span>
                  <span className="text-amber-600 font-mono">{targetSoc}%</span>
                </div>
                <input
                  type="range"
                  min={currentSoc}
                  max={2.5}
                  step={0.05}
                  value={targetSoc}
                  onChange={(e) => setTargetSoc(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Adopted Regenerative Practices
                </h3>
                <div className="space-y-2.5">
                  {[
                    { key: "noTill", label: "Zero-Till or Minimum Tillage (Happy Seeder)" },
                    { key: "coverCropping", label: "Summer Cover Cropping (Legumes / Moong)" },
                    { key: "cropResidueIncorporation", label: "Zero Stubble Burning (In-situ Mulching)" },
                    { key: "biocharApplication", label: "Biochar / Pyrolyzed Carbon Soil Amendment" },
                    { key: "vermicompost", label: "Liquid Jeevamrut & Organic Vermicompost" },
                    { key: "agroforestryBorders", label: "Boundary Agroforestry (Poplar / Teak / Neem)" },
                  ].map((item) => (
                    <label
                      key={item.key}
                      onClick={() => togglePractice(item.key)}
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 cursor-pointer text-xs transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(practices[item.key])}
                        onChange={() => {}}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Multi-Year Rotation & Subsidy Schemes (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Multi-Year Rotation Sequence */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 dark:border-emerald-950/60 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Regenerative Crop Rotation Matrix
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sequence optimized for natural nitrogen fixation and breaking continuous fungal cycles
                  </p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                  4 Seasons
                </span>
              </div>

              <div className="space-y-3">
                {rotations.map((rot, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-600 block">
                        {rot.season}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{rot.crop}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{rot.benefit}</p>
                    </div>
                    <span className="self-start sm:self-center text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                      {rot.nitrogenFixation} N-Fix
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Government Subsidy Scheme Eligibility */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 dark:border-emerald-950/60 shadow-lg space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Central & State Government Subsidies
                </h3>
                <p className="text-xs text-slate-500">
                  Government incentives tied to soil health improvement and chemical reduction
                </p>
              </div>

              <div className="space-y-3">
                {governmentSchemes.map((sch, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{sch.name}</h4>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{sch.eligibility}</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{sch.ministry}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 pt-1">{sch.incentive}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
