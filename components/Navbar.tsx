"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { SupportedLanguage, UserRole } from "@/types";
import {
  Sprout,
  ScanLine,
  FlaskConical,
  Trees,
  Building2,
  LayoutDashboard,
  Globe,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, logout, loginAsDemo } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { href: "/disease-scan", label: t("diseaseScan"), icon: ScanLine },
    { href: "/advisory", label: t("cropAdvisory"), icon: FlaskConical },
    { href: "/regenerative", label: t("regenerative"), icon: Trees },
    { href: "/state-portal", label: t("statePortal"), icon: Building2 },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/auth");
  };

  const getRoleBadgeColor = (r: UserRole) => {
    switch (r) {
      case "farmer":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      case "admin":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
      case "state_official":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30";
    }
  };

  const languages: { code: SupportedLanguage; label: string }[] = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी (Hindi)" },
    { code: "pa", label: "ਪੰਜਾਬੀ (Punjabi)" },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 dark:border-emerald-950/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-all">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                {t("appName")}
              </span>
              <span className="hidden sm:block text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                Digital Agri Network
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                    isActive
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-950/40 hover:text-emerald-600"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setUserDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-700 dark:text-slate-300"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span className="uppercase">{language}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 glass-panel rounded-xl shadow-xl py-1 border border-slate-200 dark:border-slate-800 z-50">
                  {languages.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLanguage(item.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                        language === item.code
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span>{item.label}</span>
                      {language === item.code && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Session or Login Button */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen);
                    setLangDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-600/20 text-emerald-600 flex items-center justify-center text-xs font-semibold overflow-hidden">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-200 max-w-[100px] truncate hidden md:inline-block">
                    {user.name.split(" ")[0]}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full border uppercase font-mono tracking-wider ${getRoleBadgeColor(
                      role
                    )}`}
                  >
                    {role === "state_official" ? "State" : role}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 glass-panel rounded-xl shadow-xl p-3 border border-slate-200 dark:border-slate-800 z-50">
                    <div className="pb-2 border-b border-slate-200 dark:border-slate-800 mb-2">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-[11px] text-slate-500">{user.phone || user.email}</p>
                      <p className="text-[10px] text-emerald-600 mt-0.5">
                        {user.district ? `${user.district}, ${user.state}` : "Verified Sathi"}
                      </p>
                    </div>

                    <div className="space-y-1 mb-2">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Switch Demo Role
                      </p>
                      <button
                        onClick={() => {
                          loginAsDemo("farmer");
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                          role === "farmer"
                            ? "bg-emerald-500/15 text-emerald-600 font-semibold"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span>🌾 Farmer Gurvinder</span>
                        {role === "farmer" && <span className="text-[10px] text-emerald-600 font-bold">Active</span>}
                      </button>
                      <button
                        onClick={() => {
                          loginAsDemo("admin");
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                          role === "admin"
                            ? "bg-amber-500/15 text-amber-600 font-semibold"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span>🔬 ICAR Admin Vandana</span>
                        {role === "admin" && <span className="text-[10px] text-amber-600 font-bold">Active</span>}
                      </button>
                      <button
                        onClick={() => {
                          loginAsDemo("state_official");
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                          role === "state_official"
                            ? "bg-blue-500/15 text-blue-600 font-semibold"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span>🏛️ State Director Hardeep</span>
                        {role === "state_official" && <span className="text-[10px] text-blue-600 font-bold">Active</span>}
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                      <button
                        onClick={handleLogout}
                        className="w-full px-2 py-1.5 rounded-lg text-xs text-red-600 hover:bg-red-500/10 transition-colors flex items-center gap-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t("logout")}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
              >
                {t("login")}
              </Link>
            )}

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 glass-panel px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
