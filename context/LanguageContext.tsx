"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SupportedLanguage } from "@/types";

interface Translations {
  [key: string]: string;
}

const translations: Record<SupportedLanguage, Translations> = {
  en: {
    appName: "KrishiBuddy AI",
    tagline: "Interoperable Digital Agriculture Network",
    home: "Home",
    dashboard: "Dashboard",
    diseaseScan: "Disease Scanner",
    cropAdvisory: "Soil & Crop Advisory",
    regenerative: "Regenerative Planner",
    statePortal: "State Portal",
    login: "Sign In",
    logout: "Sign Out",
    getStarted: "Get Started Free",
    welcomeBack: "Welcome back",
    demoBadge: "Farmer Persona",
    quickActions: "Quick Farm Actions",
    scanCropDesc: "Identify 62+ crop leaf diseases instantly with MobileNet AI",
    advisoryDesc: "NPK balanced fertilizer dosage & irrigation schedules",
    regenerativeDesc: "Carbon credit estimator & soil health index calculator",
    statePortalDesc: "Agristack IDEA-compliant APIs for State Agriculture Departments",
    weatherForecast: "7-Day Hyperlocal Weather",
    satelliteNDVI: "Satellite Crop Health (NDVI)",
    recentAdvisories: "Recent Agronomic Advisories",
    farmBoundary: "Geo-Fenced Farm Plot",
    sprayOptimal: "Optimal for Spraying",
    sprayCaution: "Caution: Moderate Wind",
    sprayAvoid: "Avoid: High Precipitation Risk",
    voiceExplanation: "Listen in Regional Audio",
    downloadReport: "Download PDF Report",
    confidence: "Confidence",
    treatment: "Treatment Guide",
    organicSolution: "Bio-Organic Remedy",
    chemicalSolution: "Chemical Treatment",
    preventionTips: "Preventive Measures",
    switchLanguage: "Language",
    roleFarmer: "Farmer",
    roleAdmin: "ICAR Admin",
    roleStateOfficial: "State Official",
    allRightsReserved: "Empowering 140 Million Indian Smallholders with Digital Intelligence.",
  },
  hi: {
    appName: "कृषि बडी AI",
    tagline: "भारतीय किसानों के लिए डिजिटल कृषि नेटवर्क",
    home: "होम",
    dashboard: "डैशबोर्ड",
    diseaseScan: "फसल रोग स्कैनर",
    cropAdvisory: "मृदा व फसल सलाह",
    regenerative: "पुनर्योजी कृषि योजना",
    statePortal: "राज्य कृषि पोर्टल",
    login: "लॉगिन करें",
    logout: "लॉगआउट",
    getStarted: "मुफ्त शुरुआत करें",
    welcomeBack: "स्वागत है",
    demoBadge: "किसान प्रोफ़ाइल",
    quickActions: "त्वरित कृषि कार्य",
    scanCropDesc: "मोबाइलनेट AI द्वारा 62+ फसल रोगों की तुरंत पहचान करें",
    advisoryDesc: "सटीक NPK उर्वरक मात्रा और सिंचाई समय-सारणी",
    regenerativeDesc: "कार्बन क्रेडिट अनुमान और मृदा स्वास्थ्य सूचकांक",
    statePortalDesc: "राज्य कृषि विभागों के लिए एग्रीस्टैक IDEA-अनुरूप API",
    weatherForecast: "7-दिवसीय स्थानीय मौसम पूर्वानुमान",
    satelliteNDVI: "उपग्रह फसल स्वास्थ्य (NDVI)",
    recentAdvisories: "हालिया कृषि परामर्श",
    farmBoundary: "जियो-फेंस्ड खेत का नक्शा",
    sprayOptimal: "कीटनाशक छिड़काव के लिए उपयुक्त",
    sprayCaution: "सावधानी: मध्यम हवा की गति",
    sprayAvoid: "बचें: वर्षा की अत्यधिक संभावना",
    voiceExplanation: "क्षेत्रीय आवाज़ में सुनें",
    downloadReport: "PDF रिपोर्ट डाउनलोड करें",
    confidence: "सटीकता",
    treatment: "उपचार निर्देशिका",
    organicSolution: "जैविक उपचार",
    chemicalSolution: "रासायनिक उपचार",
    preventionTips: "बचाव के उपाय",
    switchLanguage: "भाषा",
    roleFarmer: "किसान",
    roleAdmin: "ICAR वैज्ञानिक",
    roleStateOfficial: "राज्य कृषि अधिकारी",
    allRightsReserved: "डिजिटल बुद्धिमत्ता के साथ 14 करोड़ भारतीय लघु किसानों का सशक्तिकरण।",
  },
  pa: {
    appName: "ਕ੍ਰਿਸ਼ੀ ਬੱਡੀ AI",
    tagline: "ਭਾਰਤੀ ਕਿਸਾਨਾਂ ਲਈ ਡਿਜੀਟਲ ਖੇਤੀਬਾੜੀ ਨੈੱਟਵਰਕ",
    home: "ਮੁੱਖ ਪੰਨਾ",
    dashboard: "ਡੈਸ਼ਬੋਰਡ",
    diseaseScan: "ਫ਼ਸਲ ਰੋਗ ਸਕੈਨਰ",
    cropAdvisory: "ਮਿੱਟੀ ਅਤੇ ਫ਼ਸਲ ਸਲਾਹ",
    regenerative: "ਕੁਦਰਤੀ ਖੇਤੀ ਯੋਜਨਾ",
    statePortal: "ਸੂਬਾਈ ਖੇਤੀਬਾੜੀ ਪੋਰਟਲ",
    login: "ਲਾਗਇਨ ਕਰੋ",
    logout: "ਲਾਗਆਉਟ",
    getStarted: "ਮੁਫ਼ਤ ਸ਼ੁਰੂਆਤ ਕਰੋ",
    welcomeBack: "ਜੀ ਆਇਆਂ ਨੂੰ",
    demoBadge: "ਕਿਸਾਨ ਪ੍ਰੋਫਾਈਲ",
    quickActions: "ਫ਼ੌਰੀ ਖੇਤੀ ਕਾਰਜ",
    scanCropDesc: "ਮੋਬਾਈਲਨੈੱਟ AI ਰਾਹੀਂ 62+ ਫ਼ਸਲਾਂ ਦੇ ਰੋਗਾਂ ਦੀ ਤੁਰੰਤ ਪਛਾਣ",
    advisoryDesc: "ਸਹੀ NPK ਖਾਦ ਮਾਤਰਾ ਅਤੇ ਸਿੰਚਾਈ ਦਾ ਸਮਾਂ",
    regenerativeDesc: "ਕਾਰਬਨ ਕ੍ਰੈਡਿਟ ਅੰਦਾਜ਼ਾ ਅਤੇ ਮਿੱਟੀ ਸਿਹਤ ਇੰਡੈਕਸ",
    statePortalDesc: "ਸੂਬਾਈ ਖੇਤੀਬਾੜੀ ਵਿਭਾਗਾਂ ਲਈ ਐਗਰੀਸਟੈਕ IDEA APIs",
    weatherForecast: "7 ਦਿਨਾਂ ਦਾ ਸਥਾਨਕ ਮੌਸਮ",
    satelliteNDVI: "ਸੈਟੇਲਾਈਟ ਫ਼ਸਲ ਸਿਹਤ (NDVI)",
    recentAdvisories: "ਤਾਜ਼ਾ ਖੇਤੀ ਸਲਾਹਾਂ",
    farmBoundary: "ਖੇਤ ਦਾ ਨਕਸ਼ਾ",
    sprayOptimal: "ਸਪਰੇਅ ਕਰਨ ਲਈ ਅਨੁਕੂਲ ਸਮਾਂ",
    sprayCaution: "ਸਾਵਧਾਨੀ: ਦਰਮਿਆਨੀ ਹਵਾ",
    sprayAvoid: "ਬਚੋ: ਮੀਂਹ ਦਾ ਖ਼ਤਰਾ",
    voiceExplanation: "ਆਪਣੀ ਬੋਲੀ ਵਿੱਚ ਸੁਣੋ",
    downloadReport: "PDF ਰਿਪੋਰਟ ਡਾਊਨਲੋਡ ਕਰੋ",
    confidence: "ਭਰੋਸੇਯੋਗਤਾ",
    treatment: "ਇਲਾਜ ਦੇ ਨਿਰਦੇਸ਼",
    organicSolution: "ਜੈਵਿਕ ਹੱਲ",
    chemicalSolution: "ਰਸਾਇਣਕ ਹੱਲ",
    preventionTips: "ਰੋਕਥਾਮ ਦੇ ਉਪਾਅ",
    switchLanguage: "ਬੋਲੀ",
    roleFarmer: "ਕਿਸਾਨ",
    roleAdmin: "ICAR ਖੋਜੀ",
    roleStateOfficial: "ਸੂਬਾਈ ਅਧਿਕਾਰੀ",
    allRightsReserved: "ਡਿਜੀਟਲ ਤਕਨੀਕ ਨਾਲ 14 ਕਰੋੜ ਭਾਰਤੀ ਕਿਸਾਨਾਂ ਦਾ ਸਸ਼ਕਤੀਕਰਨ।",
  },
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>("en");

  useEffect(() => {
    const saved = localStorage.getItem("krishibuddy_lang") as SupportedLanguage;
    if (saved && (saved === "en" || saved === "hi" || saved === "pa")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem("krishibuddy_lang", lang);
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
