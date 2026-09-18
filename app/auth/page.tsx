"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { UserRole } from "@/types";
import {
  Sprout,
  ShieldCheck,
  Building2,
  Phone,
  KeyRound,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const { loginWithPhoneOtp, loginWithGoogle, loginAsDemo, role, loading } = useAuth();
  const { t } = useLanguage();

  const [authMethod, setAuthMethod] = useState<"phone" | "google" | "quick">("phone");
  const [selectedRole, setSelectedRole] = useState<UserRole>("farmer");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [fullName, setFullName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number");
      return;
    }
    setErrorMsg("");
    setOtpSent(true);
    setSuccessMsg("Demo OTP code is 123456");
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setErrorMsg("Please enter the 6-digit OTP (e.g. 123456)");
      return;
    }
    setErrorMsg("");
    const success = await loginWithPhoneOtp(phoneNumber, otp, selectedRole, fullName || "Kisan Sathi");
    if (success) {
      navigateAfterAuth(selectedRole);
    } else {
      setErrorMsg("Invalid OTP. Try 123456 for instant demonstration.");
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    const success = await loginWithGoogle(selectedRole);
    if (success) {
      navigateAfterAuth(selectedRole);
    }
  };

  const handleQuickLogin = async (targetRole: UserRole) => {
    setErrorMsg("");
    await loginAsDemo(targetRole);
    navigateAfterAuth(targetRole);
  };

  const navigateAfterAuth = (userRole: UserRole) => {
    if (userRole === "state_official") {
      router.push("/state-portal");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#040d0a] text-slate-900 dark:text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
            <Sprout className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
              KrishiBuddy AI
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">कृषि बडी • Digital Agriculture Network</p>
          </div>
        </div>

        <h2 className="text-center text-xl font-bold tracking-tight text-slate-800 dark:text-white">
          Sign In to Your Agricultural Portal
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400">
          Interoperable access for Farmers, Agricultural Scientists & State Officers
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-panel py-8 px-4 sm:px-8 shadow-2xl rounded-2xl border border-slate-200/80 dark:border-emerald-950/60">
          {/* Persona / Role Selector */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
              Select Your Operational Role:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole("farmer")}
                className={`py-2 px-2.5 rounded-xl text-xs font-medium border flex flex-col items-center gap-1 transition-all ${
                  selectedRole === "farmer"
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-semibold"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-emerald-300"
                }`}
              >
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>Farmer</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("admin")}
                className={`py-2 px-2.5 rounded-xl text-xs font-medium border flex flex-col items-center gap-1 transition-all ${
                  selectedRole === "admin"
                    ? "bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300 font-semibold"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-amber-300"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>ICAR Admin</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("state_official")}
                className={`py-2 px-2.5 rounded-xl text-xs font-medium border flex flex-col items-center gap-1 transition-all ${
                  selectedRole === "state_official"
                    ? "bg-blue-500/10 border-blue-500 text-blue-700 dark:text-blue-300 font-semibold"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-300"
                }`}
              >
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>State Official</span>
              </button>
            </div>
          </div>

          {/* Tab buttons */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
            <button
              onClick={() => setAuthMethod("phone")}
              className={`flex-1 pb-2.5 text-xs font-medium border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                authMethod === "phone"
                  ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Phone OTP</span>
            </button>
            <button
              onClick={() => setAuthMethod("quick")}
              className={`flex-1 pb-2.5 text-xs font-medium border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                authMethod === "quick"
                  ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Personas</span>
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="mb-4 p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600 dark:text-red-400 text-xs">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Phone Method */}
          {authMethod === "phone" && (
            <div>
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                      Full Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Gurvinder Singh"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                      Mobile Number (+91)
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="9876543210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm rounded-r-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                      Enter 6-Digit OTP Sent to +91 {phoneNumber}
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm tracking-widest font-mono rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Hint: Use demo code 123456</p>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Verify & Continue</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="w-full text-center text-xs text-slate-500 hover:text-slate-700 underline"
                  >
                    Change Phone Number
                  </button>
                </form>
              )}

              {/* Google OAuth Option */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white dark:bg-[#07140f] px-2 text-slate-500">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-xs font-medium text-slate-700 dark:text-slate-200 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google OAuth Sign-In</span>
              </button>
            </div>
          )}

          {/* Instant Demo Personas Tab */}
          {authMethod === "quick" && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 mb-2">
                Click any profile to test KrishiBuddy AI without manual sign up:
              </p>

              <button
                type="button"
                onClick={() => handleQuickLogin("farmer")}
                className="w-full text-left p-3 rounded-xl border border-emerald-500/30 hover:border-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold text-sm">
                    🌾
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-emerald-500">
                      Gurvinder Singh
                    </h4>
                    <p className="text-[11px] text-slate-500">Farmer • Ludhiana, Punjab (4.8 Acres)</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transform group-hover:translate-x-1 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("admin")}
                className="w-full text-left p-3 rounded-xl border border-amber-500/30 hover:border-amber-500 bg-amber-500/5 hover:bg-amber-500/10 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold text-sm">
                    🔬
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-amber-500">
                      Dr. Vandana Rao
                    </h4>
                    <p className="text-[11px] text-slate-500">ICAR Chief Agricultural Scientist</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transform group-hover:translate-x-1 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("state_official")}
                className="w-full text-left p-3 rounded-xl border border-blue-500/30 hover:border-blue-500 bg-blue-500/5 hover:bg-blue-500/10 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-600 flex items-center justify-center font-bold text-sm">
                    🏛️
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-500">
                      Hardeep Singh
                    </h4>
                    <p className="text-[11px] text-slate-500">Director, Dept of Agri Punjab (Agristack Portal)</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          )}

          {/* Security badge */}
          <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>Secured via Firebase Auth & Agristack Token Exchange</span>
          </div>
        </div>
      </div>
    </div>
  );
}
