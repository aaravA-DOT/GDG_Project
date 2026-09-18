"use client";

import React, { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { dbService } from "@/lib/services/db";
import {
  runPathologyInference,
  DiagnosisResult,
  PRESET_LEAF_SAMPLES,
  CROP_DISEASES_DB,
} from "@/lib/tf/diseaseModel";
import {
  Camera,
  Upload,
  ScanLine,
  Sparkles,
  Volume2,
  Download,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Leaf,
  FlaskConical,
  RefreshCw,
  Clock,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import jsPDF from "jspdf";

export default function DiseaseScanPage() {
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const [inputMode, setInputMode] = useState<"camera" | "upload" | "presets">("presets");
  const [selectedImageSrc, setSelectedImageSrc] = useState<string>(PRESET_LEAF_SAMPLES[0].image);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [speaking, setSpeaking] = useState<boolean>(false);
  const [history, setHistory] = useState<any[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load history on mount
  useEffect(() => {
    async function fetchHistory() {
      if (user) {
        const scans = await dbService.getDiseaseScans(user.uid);
        setHistory(scans);
      }
    }
    fetchHistory();
  }, [user]);

  // Handle Camera streaming
  const startCamera = async () => {
    setInputMode("camera");
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn("Camera access denied or unavailable, switching to presets/upload", err);
      setCameraActive(false);
      setInputMode("presets");
      alert("Camera access was not permitted. You can use the Preset Leaf Samples or upload an image.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // Capture from live camera
  const captureCameraFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setSelectedImageSrc(dataUrl);
      stopCamera();
      triggerInference(canvas);
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setSelectedImageSrc(result);

      // Draw onto hidden canvas for TF inference
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          canvas.width = img.width || 400;
          canvas.height = img.height || 400;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0);
          triggerInference(canvas);
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  // Trigger inference for preset leaf
  const handlePresetSelect = (preset: (typeof PRESET_LEAF_SAMPLES)[0]) => {
    setSelectedImageSrc(preset.image);
    stopCamera();

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = img.width || 400;
        canvas.height = img.height || 400;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        triggerInference(canvas, preset.key);
      }
    };
    img.src = preset.image;
  };

  const triggerInference = async (canvas: HTMLCanvasElement, forcedKey?: string) => {
    setAnalyzing(true);
    setDiagnosis(null);

    // Simulate realistic inference delay for model pass
    setTimeout(async () => {
      try {
        const result = await runPathologyInference(canvas, forcedKey);
        setDiagnosis(result);

        // Save scan to history
        if (user) {
          const saved = await dbService.saveDiseaseScan({
            farmerId: user.uid,
            imageUrl: selectedImageSrc,
            disease: result.disease,
            confidence: result.confidence,
            treatment: result.chemicalRemedy,
            organicRemedy: result.organicRemedy,
            chemicalRemedy: result.chemicalRemedy,
            prevention: result.prevention,
            affectedCrop: result.crop,
            pathogenType: result.pathogenType,
            severity: result.severity,
            createdAt: Date.now(),
          });
          setHistory((prev) => [saved, ...prev]);
        }
      } catch (err) {
        console.error("Diagnosis error:", err);
      } finally {
        setAnalyzing(false);
      }
    }, 900);
  };

  // Text-To-Speech audio readout
  const playAudioVoice = () => {
    if (!diagnosis) return;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      if (speaking) {
        setSpeaking(false);
        return;
      }

      const text =
        language === "hi"
          ? diagnosis.audioText.hi
          : language === "pa"
          ? diagnosis.audioText.pa
          : diagnosis.audioText.en;

      const utterance = new SpeechSynthesisUtterance(text);
      if (language === "hi") utterance.lang = "hi-IN";
      else if (language === "pa") utterance.lang = "pa-IN";
      else utterance.lang = "en-IN";
      utterance.rate = 0.95;

      setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Generate PDF Diagnostic Report
  const downloadPdfReport = () => {
    if (!diagnosis) return;
    const doc = new jsPDF();

    // Header
    doc.setFillColor(16, 185, 129);
    doc.rect(0, 0, 210, 30, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("KrishiBuddy AI - Crop Pathology Diagnostic Report", 14, 18);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Interoperable Agristack Diagnostic Certificate", 14, 25);

    // Patient/Farmer Details
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.text(`Farmer Name: ${user?.name || "Kisan Sathi"}`, 14, 42);
    doc.text(`Date of Scan: ${new Date().toLocaleDateString()}`, 14, 50);
    doc.text(`Crop Scanned: ${diagnosis.crop}`, 14, 58);

    // Disease Findings Box
    doc.setDrawColor(16, 185, 129);
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(14, 66, 182, 35, 3, 3, "FD");

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(6, 95, 70);
    doc.text(`Diagnosis: ${diagnosis.disease}`, 18, 76);

    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(`Pathogen: ${diagnosis.scientificName} (${diagnosis.pathogenType})`, 18, 83);

    doc.setFont("helvetica", "normal");
    doc.text(
      `AI Confidence Score: ${diagnosis.confidence}%  |  Severity Rating: ${diagnosis.severity}`,
      18,
      92
    );

    // Bio-Organic Remedy
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(180, 83, 9);
    doc.text("1. Recommended Bio-Organic Treatment (Eco-Friendly):", 14, 112);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    const splitOrganic = doc.splitTextToSize(diagnosis.organicRemedy, 180);
    doc.text(splitOrganic, 14, 120);

    // Chemical Remedy
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 99, 235);
    doc.text("2. Targeted Chemical Fungicide / Antibiotic:", 14, 140);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    const splitChem = doc.splitTextToSize(diagnosis.chemicalRemedy, 180);
    doc.text(splitChem, 14, 148);

    // Preventive Protocol
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 185, 129);
    doc.text("3. Preventive & Cultural Field Practices:", 14, 168);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    const splitPrev = doc.splitTextToSize(diagnosis.prevention, 180);
    doc.text(splitPrev, 14, 176);

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text(
      "Validated by KrishiBuddy AI MobileNet Neural Architecture. Follow ICAR CIBRC safety guidelines before spraying.",
      14,
      280
    );

    doc.save(`KrishiBuddy_Diagnosis_${diagnosis.disease.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#040d0a] text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hidden Canvas for computation */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <ScanLine className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t("diseaseScan")}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-mono">
                MobileNetV2
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              On-device deep learning leaf pathology detector. Classifies 62+ crop leaf conditions with immediate bio-remedy recipes.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-800">
            <button
              onClick={() => {
                setInputMode("presets");
                stopCamera();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                inputMode === "presets"
                  ? "bg-white dark:bg-emerald-600 text-emerald-700 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Preset Samples
            </button>
            <button
              onClick={startCamera}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                inputMode === "camera"
                  ? "bg-white dark:bg-emerald-600 text-emerald-700 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera</span>
            </button>
            <button
              onClick={() => {
                setInputMode("upload");
                stopCamera();
                fileInputRef.current?.click();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                inputMode === "upload"
                  ? "bg-white dark:bg-emerald-600 text-emerald-700 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload</span>
            </button>
          </div>
        </div>

        {/* MAIN SCANNING & DIAGNOSIS WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image Viewer / Camera / Presets (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-panel p-4 rounded-2xl border border-slate-200/80 dark:border-emerald-950/60 overflow-hidden relative">
              {/* Camera Video View */}
              {cameraActive ? (
                <div className="relative rounded-xl overflow-hidden bg-black aspect-square flex items-center justify-center">
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Camera overlay crosshairs */}
                  <div className="absolute inset-8 border-2 border-emerald-500/50 rounded-2xl pointer-events-none flex items-center justify-center">
                    <p className="text-[11px] text-white bg-black/60 px-2 py-1 rounded backdrop-blur">
                      Center infected leaf in frame
                    </p>
                  </div>
                  <button
                    onClick={captureCameraFrame}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capture & Diagnose</span>
                  </button>
                </div>
              ) : (
                /* Static Image Preview with Scanning Animation */
                <div className="relative rounded-xl overflow-hidden bg-slate-100 dark:bg-[#07140f] aspect-square flex items-center justify-center border border-slate-200 dark:border-slate-800">
                  <img
                    src={selectedImageSrc}
                    alt="Target leaf"
                    className="w-full h-full object-cover"
                  />

                  {/* Laser Scanning Bar during inference */}
                  {analyzing && (
                    <div className="absolute inset-0 bg-emerald-500/10 flex flex-col items-center justify-center">
                      <div className="w-full h-1 bg-emerald-400 shadow-[0_0_15px_#34d399] animate-bounce" />
                      <div className="mt-4 px-4 py-2 rounded-xl bg-black/80 text-emerald-400 text-xs font-mono font-semibold flex items-center gap-2 backdrop-blur">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>MobileNetV2 Feature Extraction...</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Quick action bar under image */}
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Resolution: High-Fidelity 224x224 TF Tensor</span>
                {!cameraActive && (
                  <button
                    onClick={() => {
                      if (canvasRef.current) {
                        const img = new Image();
                        img.crossOrigin = "anonymous";
                        img.onload = () => {
                          const canvas = canvasRef.current!;
                          canvas.width = img.width || 400;
                          canvas.height = img.height || 400;
                          canvas.getContext("2d")?.drawImage(img, 0, 0);
                          triggerInference(canvas);
                        };
                        img.src = selectedImageSrc;
                      }
                    }}
                    className="text-emerald-600 font-semibold hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Re-analyze</span>
                  </button>
                )}
              </div>
            </div>

            {/* PRESET GALLERY CARDS (For instant testing without a live camera) */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Or Test Instant Presets (62+ Pathology Samples):
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_LEAF_SAMPLES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handlePresetSelect(sample)}
                    className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 bg-white dark:bg-[#07140f] text-left transition-all group overflow-hidden"
                  >
                    <img
                      src={sample.image}
                      alt={sample.name}
                      className="w-full h-16 object-cover rounded-lg group-hover:scale-105 transition-transform"
                    />
                    <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate mt-1">
                      {sample.name}
                    </p>
                    <p className="text-[10px] text-slate-400">{sample.crop}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: AI Diagnosis Breakdown (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {diagnosis ? (
              <div className="glass-panel p-6 rounded-2xl border border-emerald-500/40 shadow-xl space-y-6">
                {/* Header with Title & Confidence Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-emerald-950/60">
                  <div>
                    <span
                      className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                        diagnosis.severity === "Severe"
                          ? "bg-red-500/10 text-red-600 border border-red-500/30"
                          : diagnosis.severity === "Moderate"
                          ? "bg-amber-500/10 text-amber-600 border border-amber-500/30"
                          : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                      }`}
                    >
                      {diagnosis.severity} • {diagnosis.pathogenType} Pathogen
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                      {diagnosis.disease}
                    </h2>
                    <p className="text-xs text-slate-500 italic">
                      {diagnosis.scientificName} • Affected Crop: <b>{diagnosis.crop}</b>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-right">
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 block font-medium">
                        Model Confidence
                      </span>
                      <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                        {diagnosis.confidence}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Regional Audio Speech & PDF Report Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={playAudioVoice}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2"
                  >
                    <Volume2 className={`w-4 h-4 ${speaking ? "animate-pulse text-amber-300" : ""}`} />
                    <span>{speaking ? "Playing Regional Voice..." : t("voiceExplanation")}</span>
                  </button>

                  <button
                    onClick={downloadPdfReport}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-all flex items-center gap-2 text-slate-800 dark:text-slate-200"
                  >
                    <Download className="w-4 h-4 text-emerald-600" />
                    <span>{t("downloadReport")}</span>
                  </button>
                </div>

                {/* Symptoms Observed */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Key Diagnostic Symptoms</span>
                  </h4>
                  <ul className="space-y-1">
                    {diagnosis.symptoms.map((symp, i) => (
                      <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{symp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* BIO-ORGANIC REMEDY CARD */}
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs mb-1">
                    <Leaf className="w-4 h-4" />
                    <span>{t("organicSolution")} (Eco-Friendly)</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                    {diagnosis.organicRemedy}
                  </p>
                </div>

                {/* CHEMICAL REMEDY CARD */}
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-xs mb-1">
                    <FlaskConical className="w-4 h-4" />
                    <span>{t("chemicalSolution")} (Standard Agronomic)</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                    {diagnosis.chemicalRemedy}
                  </p>
                </div>

                {/* PREVENTIVE PRACTICES */}
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t("preventionTips")}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                    {diagnosis.prevention}
                  </p>
                </div>
              </div>
            ) : (
              /* Placeholder before scanning */
              <div className="glass-panel p-12 rounded-2xl border border-slate-200/80 dark:border-emerald-950/60 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                  <ScanLine className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Select a Leaf Sample or Capture via Camera
                </h3>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed mb-6">
                  KrishiBuddy&apos;s MobileNet engine will detect necrotic leaf spot patterns, chlorosis rings, and fungal spores in real time.
                </p>
                <button
                  onClick={() => handlePresetSelect(PRESET_LEAF_SAMPLES[0])}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Test Sample 1: Tomato Early Blight</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SCAN HISTORY */}
        {history.length > 0 && (
          <div className="pt-6 border-t border-slate-200/80 dark:border-emerald-950/60">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Recent Leaf Diagnostic History ({history.length} Scans Saved)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {history.map((scan) => (
                <div
                  key={scan.id}
                  className="glass-card p-3 rounded-xl flex items-center gap-3 border border-slate-200/80 dark:border-slate-800"
                >
                  <img
                    src={scan.imageUrl}
                    alt={scan.disease}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {scan.disease}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {scan.confidence}% • {new Date(scan.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
