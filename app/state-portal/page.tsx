"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { dbService, DEMO_STATE_APIS } from "@/lib/services/db";
import { StateApiConfig } from "@/types";
import {
  Building2,
  KeyRound,
  ShieldCheck,
  Code2,
  Download,
  Copy,
  Check,
  Activity,
  Server,
  Zap,
  Clock,
  Sparkles,
  Lock,
  Globe2,
} from "lucide-react";

export default function StatePortalPage() {
  const { user, role, loginAsDemo } = useAuth();
  const { t } = useLanguage();

  const [stateApis, setStateApis] = useState<StateApiConfig[]>(DEMO_STATE_APIS);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedSchema, setCopiedSchema] = useState<boolean>(false);

  // Form state for generating new API key
  const [newStateName, setNewStateName] = useState("Madhya Pradesh");
  const [newEmail, setNewEmail] = useState("director.agri@mp.gov.in");
  const [newRateLimit, setNewRateLimit] = useState(1500);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedKeyResult, setGeneratedKeyResult] = useState<StateApiConfig | null>(null);

  useEffect(() => {
    async function loadApis() {
      const list = await dbService.getStateApis();
      setStateApis(list);
    }
    loadApis();
  }, []);

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/state-api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stateName: newStateName,
          contactEmail: newEmail,
          rateLimit: newRateLimit,
          allowedScopes: ["farms.read", "advisory.write", "soil.sync", "agristack.idea"],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const newEntry: StateApiConfig = {
          id: `state-${Date.now()}`,
          stateName: data.stateName,
          apiKey: data.apiKey,
          contactEmail: newEmail,
          rateLimit: data.rateLimit,
          usageCount: 0,
          createdAt: data.issuedAt,
          lastUsed: data.issuedAt,
          status: "active",
          allowedScopes: data.allowedScopes,
        };
        setStateApis((prev) => [newEntry, ...prev]);
        setGeneratedKeyResult(newEntry);
      }
    } catch (err) {
      console.error("Failed to issue key", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const agristackJsonLdSchema = {
    "@context": [
      "https://schema.org",
      {
        "agristack": "https://agristack.gov.in/ontology/v1#",
        "idea": "https://digitalindia.gov.in/idea#",
        "kisanId": "agristack:farmerId",
        "cadastralPlot": "agristack:plotGeometry",
        "soilProfile": "agristack:soilNutrientIndex",
      },
    ],
    "@type": "AgriculturalFacility",
    "name": "Green Harvest Acres (Ludhiana)",
    "kisanId": "IN-PB-LDH-2026-98741",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ludhiana",
      "addressRegion": "Punjab",
      "addressCountry": "IN",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 30.901,
      "longitude": 75.8573,
    },
    "cadastralPlot": {
      "type": "Polygon",
      "coordinates": [
        [
          [75.855, 30.9035],
          [75.861, 30.904],
          [75.862, 30.898],
          [75.856, 30.8975],
          [75.855, 30.9035],
        ],
      ],
    },
    "soilProfile": {
      "nitrogenKgPerHa": 245,
      "phosphorusKgPerHa": 48,
      "potassiumKgPerHa": 195,
      "phReaction": 7.2,
      "organicCarbonPercent": 0.68,
      "ndviVegetationIndex": 0.78,
    },
    "governingFramework": "India Digital Ecosystem for Agriculture (IDEA-1.2)",
  };

  const downloadOpenApiSpec = () => {
    const openApiJson = {
      openapi: "3.0.3",
      info: {
        title: "KrishiBuddy AI - State Agriculture Interoperability API",
        version: "1.2.0",
        description:
          "Open RESTful and JSON-LD data rails enabling State Agriculture Departments to synchronize farmer cadastral plot boundaries, satellite remote sensing NDVI feeds, and targeted advisory dissemination.",
      },
      servers: [{ url: "https://api.krishibuddy.in/v1", description: "National Production Gateway" }],
      paths: {
        "/api/farms": {
          get: {
            summary: "List geo-referenced farm plots within state jurisdiction",
            security: [{ BearerAuth: [] }],
            responses: { "200": { description: "Cadastral plots array in GeoJSON format" } },
          },
        },
        "/api/advisories": {
          post: {
            summary: "Broadcast state-level agricultural warning",
            security: [{ BearerAuth: [] }],
            responses: { "201": { description: "Advisory broadcast confirmed" } },
          },
        },
      },
    };

    const blob = new Blob([JSON.stringify(openApiJson, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "KrishiBuddy_Agristack_OpenAPI3.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#040d0a] text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* State Official Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-emerald-950/60">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t("statePortal")} (Agristack IDEA)
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 border border-purple-500/20 font-mono">
                OAuth 2.0 / IDEA v1.2
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Interoperable government collaboration gateway for State Agricultural Departments, ICAR Extension Wings, and Agristack Registries.
            </p>
          </div>

          {/* Persona quick switch notice if farmer */}
          {role === "farmer" && (
            <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs">
              <span>Viewing in Preview Mode.</span>
              <button
                onClick={() => loginAsDemo("state_official")}
                className="font-bold underline hover:text-amber-800"
              >
                Switch to State Director Profile
              </button>
            </div>
          )}
        </div>

        {/* 4 TELEMETRY & API METRICS WIDGETS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-2xl border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Daily Request Volume</span>
              <Activity className="w-4 h-4 text-purple-500" />
            </div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">131,060</span>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">↑ +14.2% across state nodes</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Mean Gateway Latency</span>
              <Zap className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">42 ms</span>
            <p className="text-[11px] text-slate-500 mt-1">Edge cached across Indian regions</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Active State Registries</span>
              <Globe2 className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
              {stateApis.length} States
            </span>
            <p className="text-[11px] text-slate-500 mt-1">Punjab, Maharashtra, MP, UP</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border-l-4 border-l-teal-500">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Data Standard</span>
              <Code2 className="w-4 h-4 text-teal-500" />
            </div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">JSON-LD</span>
            <p className="text-[11px] text-slate-500 mt-1">IDEA Agricultural Ontology v1.2</p>
          </div>
        </div>

        {/* 2-COLUMN SECTION: KEY GENERATOR & ACTIVE KEYS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: API Key Generator (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <form
              onSubmit={handleGenerateKey}
              className="glass-panel p-6 rounded-2xl border border-slate-200/80 dark:border-emerald-950/60 shadow-lg space-y-4"
            >
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-purple-600" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Issue State API Key (OAuth 2.0)
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Authorized credentials allow state departments to query farm plot boundaries and push broadcast advisories.
              </p>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  State / Territory Name
                </label>
                <input
                  type="text"
                  value={newStateName}
                  onChange={(e) => setNewStateName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Department Contact Email
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Requested Rate Limit (Requests / Minute)
                </label>
                <select
                  value={newRateLimit}
                  onChange={(e) => setNewRateLimit(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                >
                  <option value={500}>500 req/min (Standard Research)</option>
                  <option value={1000}>1,000 req/min (District Extension)</option>
                  <option value={2500}>2,500 req/min (State-Wide Registry Sync)</option>
                </select>
              </div>

              <div className="pt-2">
                <p className="text-[11px] font-semibold text-slate-400 mb-2">Granted Scopes:</p>
                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>farms.read (GeoJSON plot boundaries)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>advisory.write (Broadcast alerts)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>soil.sync (NPK laboratory ingestion)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>agristack.idea (IDEA federation)</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>{isSubmitting ? "Generating Credentials..." : "Generate State API Key"}</span>
              </button>
            </form>

            {/* Success Modal / Banner when key generated */}
            {generatedKeyResult && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 space-y-2">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Key Issued Successfully for {generatedKeyResult.stateName}</span>
                </span>
                <div className="p-2 rounded-lg bg-black/40 font-mono text-[11px] text-emerald-300 break-all flex items-center justify-between">
                  <span>{generatedKeyResult.apiKey}</span>
                  <button
                    onClick={() => copyToClipboard(generatedKeyResult.apiKey, "new")}
                    className="ml-2 p-1 hover:text-white"
                  >
                    {copiedKey === "new" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  Include as &apos;Authorization: Bearer &lt;key&gt;&apos; in HTTP requests.
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Active Keys & Access Log Table (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 dark:border-emerald-950/60 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Active State API Credentials ({stateApis.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live telemetry connections authorized under Agristack IDEA protocol
                  </p>
                </div>
                <button
                  onClick={downloadOpenApiSpec}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-purple-500" />
                  <span>OpenAPI Spec</span>
                </button>
              </div>

              <div className="space-y-3">
                {stateApis.map((api) => (
                  <div
                    key={api.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {api.stateName} Department of Agriculture
                        </h4>
                      </div>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">
                        {api.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 font-mono bg-slate-100 dark:bg-slate-950 p-2 rounded-lg">
                      <span className="truncate max-w-[280px]">{api.apiKey}</span>
                      <button
                        onClick={() => copyToClipboard(api.apiKey, api.id)}
                        className="p-1 hover:text-emerald-500 flex items-center gap-1 text-[11px]"
                      >
                        {copiedKey === api.id ? (
                          <span className="text-emerald-500 font-semibold">Copied!</span>
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Rate Limit: {api.rateLimit} req/min</span>
                      <span>Total Calls: {api.usageCount.toLocaleString()}</span>
                      <span>Contact: {api.contactEmail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* JSON-LD AGRISTACK SCHEMA VIEWER */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 dark:border-emerald-950/60 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                    Interoperable JSON-LD Agristack Data Model
                  </h3>
                  <p className="text-xs text-slate-500">
                    Standardized ontology schema representation for cadastral plot sharing
                  </p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(agristackJsonLdSchema, null, 2));
                    setCopiedSchema(true);
                    setTimeout(() => setCopiedSchema(false), 2000);
                  }}
                  className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5"
                >
                  {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSchema ? "Copied" : "Copy JSON-LD"}</span>
                </button>
              </div>

              <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-200 text-[11px] font-mono overflow-x-auto max-h-64 border border-slate-800">
                {JSON.stringify(agristackJsonLdSchema, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
