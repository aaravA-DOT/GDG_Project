"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { dbService } from "@/lib/services/db";
import {
  FlaskConical,
  Sprout,
  Droplets,
  Calendar,
  Sparkles,
  Download,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  MapPin,
  BookmarkCheck,
} from "lucide-react";
import jsPDF from "jspdf";

export default function CropAdvisoryPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Soil and Location form state
  const [nitrogen, setNitrogen] = useState<number>(240);
  const [phosphorus, setPhosphorus] = useState<number>(45);
  const [potassium, setPotassium] = useState<number>(190);
  const [ph, setPh] = useState<number>(7.2);
  const [soilType, setSoilType] = useState<string>("Alluvial Loam");
  const [state, setState] = useState<string>("Punjab");
  const [district, setDistrict] = useState<string>("Ludhiana");
  const [season, setSeason] = useState<"Rabi" | "Kharif" | "Zaid">("Rabi");
  const [irrigationType, setIrrigationType] = useState<string>("Tubewell + Canal");

  const [loading, setLoading] = useState<boolean>(false);
  const [advisoryResult, setAdvisoryResult] = useState<any>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/crop-advisory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nitrogen,
          phosphorus,
          potassium,
          ph,
          soilType,
          state,
          district,
          season,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAdvisoryResult(data);
      }
    } catch (err) {
      console.error("Advisory error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToDashboard = async () => {
    if (!advisoryResult || !user) return;
    const topCrop = advisoryResult.crops[0]?.name || "Wheat";
    await dbService.addAdvisory({
      farmerId: user.uid,
      farmId: "farm-ludhiana-01",
      type: "crop",
      title: `${season} Season Crop Advisory: ${topCrop}`,
      recommendation: `Recommended ${topCrop} with ${advisoryResult.crops[0]?.suitability}% suitability. Apply ${advisoryResult.fertilizer.ureaKgPerAcre}kg Urea & ${advisoryResult.fertilizer.dapKgPerAcre}kg DAP per acre.`,
      confidence: advisoryResult.crops[0]?.suitability || 95,
      createdAt: Date.now(),
      viewed: false,
      fertilizerPlan: advisoryResult.fertilizer,
    });
    setSavedSuccess(true);
  };

  const downloadAdvisoryPdf = () => {
    if (!advisoryResult) return;
    const doc = new jsPDF();

    // Header banner
    doc.setFillColor(16, 185, 129);
    doc.rect(0, 0, 210, 30, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("KrishiBuddy AI - Soil & Crop Advisory Report", 14, 18);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Balanced NPK Nutrition & Precision Agronomy Plan", 14, 25);

    // Profile Details
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.text(`Farmer: ${user?.name || "Kisan Sathi"}`, 14, 42);
    doc.text(`Region: ${district}, ${state}  |  Season: ${season}`, 14, 50);
    doc.text(
      `Soil Parameters: N=${nitrogen} kg/ha, P=${phosphorus} kg/ha, K=${potassium} kg/ha, pH=${ph}`,
      14,
      58
    );

    // Top Recommended Crop Box
    doc.setDrawColor(16, 185, 129);
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(14, 66, 182, 30, 3, 3, "FD");

    const top = advisoryResult.crops[0];
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(6, 95, 70);
    doc.text(`Top Crop: ${top.name} (${top.suitability}% Match)`, 18, 77);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Expected Yield: ${top.expectedYieldQuintalPerAcre} Q/Acre | ${top.waterRequirement}`, 18, 86);

    // Fertilizer Section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(180, 83, 9);
    doc.text("Custom Fertilizer Optimization (per Acre):", 14, 108);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    doc.text(`• Urea (Neem-Coated): ${advisoryResult.fertilizer.ureaKgPerAcre} kg / acre`, 18, 118);
    doc.text(`• DAP (Di-Ammonium Phosphate): ${advisoryResult.fertilizer.dapKgPerAcre} kg / acre`, 18, 126);
    doc.text(`• MOP (Muriate of Potash): ${advisoryResult.fertilizer.mopKgPerAcre} kg / acre`, 18, 134);

    // Irrigation & Schedule
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 99, 235);
    doc.text("Irrigation Protocol:", 14, 150);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    doc.text(`Method: ${advisoryResult.irrigation.recommendedMethod}`, 18, 160);
    doc.text(`Interval: Every ${advisoryResult.irrigation.intervalDays} days`, 18, 168);

    doc.save(`KrishiBuddy_Advisory_${season}_${district}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#040d0a] text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <FlaskConical className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t("cropAdvisory")} & NPK Engine
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 font-mono">
                ICAR Formulations
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Precision nutrient optimization algorithm. Balances N-P-K stoichiometric ratios and suggests top-yielding crops for your soil chemistry.
            </p>
          </div>
        </div>

        {/* 2-COLUMN LAYOUT: FORM & RESULTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Soil & Location Input Form (5 Cols) */}
          <div className="lg:col-span-5">
            <form
              onSubmit={handleSubmit}
              className="glass-panel p-6 rounded-2xl border border-slate-200/80 dark:border-emerald-950/60 shadow-lg space-y-5"
            >
              <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                1. Soil Health Laboratory Parameters
              </h2>

              {/* Nitrogen Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Nitrogen (N)</span>
                  <span className="text-emerald-600 font-mono">{nitrogen} kg/ha</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={450}
                  step={5}
                  value={nitrogen}
                  onChange={(e) => setNitrogen(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>Deficient (&lt;150)</span>
                  <span>Medium (150-300)</span>
                  <span>High (&gt;300)</span>
                </div>
              </div>

              {/* Phosphorus Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Phosphorus (P)</span>
                  <span className="text-amber-600 font-mono">{phosphorus} kg/ha</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={2}
                  value={phosphorus}
                  onChange={(e) => setPhosphorus(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>Low (&lt;25)</span>
                  <span>Optimal (25-50)</span>
                  <span>High (&gt;50)</span>
                </div>
              </div>

              {/* Potassium Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Potassium (K)</span>
                  <span className="text-blue-600 font-mono">{potassium} kg/ha</span>
                </div>
                <input
                  type="range"
                  min={60}
                  max={350}
                  step={5}
                  value={potassium}
                  onChange={(e) => setPotassium(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>Low (&lt;120)</span>
                  <span>Medium (120-250)</span>
                  <span>High (&gt;250)</span>
                </div>
              </div>

              {/* Soil pH Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Soil pH Reaction</span>
                  <span className="text-purple-600 font-mono">{ph} pH</span>
                </div>
                <input
                  type="range"
                  min={5.5}
                  max={8.5}
                  step={0.1}
                  value={ph}
                  onChange={(e) => setPh(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>Acidic (&lt;6.5)</span>
                  <span>Neutral (6.5-7.5)</span>
                  <span>Alkaline (&gt;7.5)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3">
                  2. Geography & Cropping Season
                </h2>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">State</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full text-xs font-medium px-2.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                    >
                      <option value="Punjab">Punjab</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">District</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full text-xs font-medium px-2.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Cropping Season</label>
                    <select
                      value={season}
                      onChange={(e) => setSeason(e.target.value as any)}
                      className="w-full text-xs font-medium px-2.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                    >
                      <option value="Rabi">Rabi (Winter - Oct to Mar)</option>
                      <option value="Kharif">Kharif (Monsoon - Jun to Nov)</option>
                      <option value="Zaid">Zaid (Summer - Mar to Jun)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Soil Texture</label>
                    <select
                      value={soilType}
                      onChange={(e) => setSoilType(e.target.value)}
                      className="w-full text-xs font-medium px-2.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                    >
                      <option value="Alluvial Loam">Alluvial Loam</option>
                      <option value="Black Cotton">Black Cotton</option>
                      <option value="Red Sandy">Red Sandy Loam</option>
                      <option value="Clay Loam">Clay Loam</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? "Computing Agronomic Optimization..." : "Generate AI Advisory & Fertilizer Plan"}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Advisory Recommendations (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {advisoryResult ? (
              <div className="glass-panel p-6 rounded-2xl border border-emerald-500/40 shadow-xl space-y-6">
                {/* Result Top Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-emerald-950/60">
                  <div>
                    <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      Recommendation Ready
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                      {season} Season Agronomic Prescription
                    </h2>
                    <p className="text-xs text-slate-500">
                      Calculated for {district}, {state} ({soilType})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveToDashboard}
                      className="px-3 py-1.5 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold transition-all flex items-center gap-1.5"
                    >
                      <BookmarkCheck className="w-4 h-4" />
                      <span>{savedSuccess ? "Saved to Farm!" : "Save Plan"}</span>
                    </button>
                    <button
                      onClick={downloadAdvisoryPdf}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export PDF</span>
                    </button>
                  </div>
                </div>

                {/* Top Recommended Crops */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Top Recommended Crops (Soil Compatibility Score)
                  </h3>
                  <div className="space-y-3">
                    {advisoryResult.crops.map((crop: any, i: number) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <Sprout className="w-4 h-4 text-emerald-600" />
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {crop.name}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-500">{crop.keyAdvantage}</p>
                          <p className="text-[11px] text-slate-400">
                            Exp. Yield: <b>{crop.expectedYieldQuintalPerAcre} Q/Ac</b> • {crop.waterRequirement}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                            {crop.suitability}%
                          </span>
                          <span className="block text-[10px] text-slate-400 uppercase">Suitability</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FERTILIZER DOSAGE BOX */}
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                  <h3 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                    Precision Fertilizer Dosage (Per Acre)
                  </h3>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900 border border-amber-500/20">
                      <span className="text-[10px] text-slate-400 block uppercase">Urea (46% N)</span>
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        {advisoryResult.fertilizer.ureaKgPerAcre} kg
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900 border border-amber-500/20">
                      <span className="text-[10px] text-slate-400 block uppercase">DAP (18-46-0)</span>
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        {advisoryResult.fertilizer.dapKgPerAcre} kg
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900 border border-amber-500/20">
                      <span className="text-[10px] text-slate-400 block uppercase">MOP (60% K2O)</span>
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        {advisoryResult.fertilizer.mopKgPerAcre} kg
                      </span>
                    </div>
                  </div>

                  {/* Split Schedule */}
                  <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1 pt-2 border-t border-amber-500/20">
                    <p className="font-semibold text-amber-800 dark:text-amber-300 text-[11px]">
                      Split Application Schedule:
                    </p>
                    {advisoryResult.fertilizer.splitSchedule.map((s: any, idx: number) => (
                      <p key={idx} className="text-[11px]">
                        <b>{s.timing}:</b> {s.items}
                      </p>
                    ))}
                  </div>
                </div>

                {/* IRRIGATION TIMELINE */}
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-xs mb-2">
                    <Droplets className="w-4 h-4" />
                    <span>Irrigation Management Protocol</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-200 mb-2">
                    <b>Recommended Interval:</b> Every {advisoryResult.irrigation.intervalDays} days via{" "}
                    {advisoryResult.irrigation.recommendedMethod}.
                  </p>
                  <p className="text-[11px] text-slate-500 italic">
                    {advisoryResult.irrigation.waterSavingTip}
                  </p>
                </div>
              </div>
            ) : (
              /* Pre-submit placeholder */
              <div className="glass-panel p-12 rounded-2xl border border-slate-200/80 dark:border-emerald-950/60 text-center flex flex-col items-center justify-center min-h-[460px]">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4">
                  <FlaskConical className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Configure Your Soil Health Test Values
                </h3>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed mb-6">
                  Adjust the NPK sliders or use the default Alluvial soil profile to compute your tailored crop rotation & fertilizer schedule.
                </p>
                <button
                  onClick={handleSubmit as any}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Run Demonstration Calculation</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
