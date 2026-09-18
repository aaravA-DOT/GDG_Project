"use client";

import React from "react";
import Link from "next/link";
import { Sprout, Heart, Shield, Award, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-slate-200/80 dark:border-emerald-950/60 bg-white/60 dark:bg-[#030907]/90 backdrop-blur-md pt-12 pb-8 mt-16 text-slate-600 dark:text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-base">KrishiBuddy AI</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              India&apos;s open, interoperable agricultural intelligence network. Empowering smallholder farmers with
              satellite NDVI, MobileNet disease diagnostics, and Agristack IDEA data rails.
            </p>
            <div className="flex items-center gap-2 pt-1 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
              <Shield className="w-3.5 h-3.5" />
              <span>IDEA Agristack v1.2 Protocol Compliant</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
              Farmer Solutions
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="hover:text-emerald-500 transition-colors">
                  {t("dashboard")} & Plot Map
                </Link>
              </li>
              <li>
                <Link href="/disease-scan" className="hover:text-emerald-500 transition-colors">
                  {t("diseaseScan")} (MobileNet)
                </Link>
              </li>
              <li>
                <Link href="/advisory" className="hover:text-emerald-500 transition-colors">
                  {t("cropAdvisory")} & NPK Calculator
                </Link>
              </li>
              <li>
                <Link href="/regenerative" className="hover:text-emerald-500 transition-colors">
                  {t("regenerative")} & Carbon Credits
                </Link>
              </li>
            </ul>
          </div>

          {/* Institutional & State Rails */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
              Institutional Rails
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/state-portal" className="hover:text-emerald-500 transition-colors">
                  State Collaboration Portal
                </Link>
              </li>
              <li>
                <span className="text-slate-500">ICAR Krishi Vigyan Kendra (KVK) Network</span>
              </li>
              <li>
                <span className="text-slate-500">Google Earth Engine Sentinel-2 Hub</span>
              </li>
              <li>
                <span className="text-slate-500">PM-KISAN / PM-PRANAM Scheme Bridge</span>
              </li>
            </ul>
          </div>

          {/* Research & Trust */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
              National Impact
            </h4>
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/5 dark:bg-emerald-950/30 border border-emerald-500/20">
                <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-xs">
                  <Award className="w-3.5 h-3.5" />
                  <span>National Agri Hackathon Finalist</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Benchmarked against 62+ crop leaf pathogens across Punjab, Maharashtra & MP.
                </p>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <span>Built for Indian Agriculture with</span>
                <Heart className="w-3 h-3 text-red-500 fill-red-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} KrishiBuddy AI. {t("allRightsReserved")}
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="hover:underline cursor-pointer">Privacy Framework</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Terms of Digital Service</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">OpenAPI 3.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
