// Comprehensive TypeScript Schemas for KrishiBuddy AI Platform

export type UserRole = "farmer" | "admin" | "state_official";
export type SupportedLanguage = "en" | "hi" | "pa";

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface UserProfile {
  uid: string;
  name: string;
  phone: string;
  email?: string;
  language: SupportedLanguage;
  role: UserRole;
  createdAt: number;
  lastLogin: number;
  avatarUrl?: string;
  state?: string;
  district?: string;
}

export interface FarmCrop {
  name: string;
  season: "Kharif" | "Rabi" | "Zaid" | "Annual";
  sowingDate?: string;
  expectedHarvestDate?: string;
}

export interface Farm {
  id: string;
  farmerId: string;
  name: string;
  location: GeoPoint;
  area: number; // in Acres
  soilType: string;
  crops: FarmCrop[];
  boundary: GeoPoint[];
  soilHealth?: {
    nitrogen: number; // kg/ha
    phosphorus: number; // kg/ha
    potassium: number; // kg/ha
    ph: number;
    organicCarbon: number; // %
  };
  ndviScore?: number; // 0.0 to 1.0
  createdAt?: number;
}

export type AdvisoryType = "crop" | "soil" | "weather" | "disease";

export interface Advisory {
  id: string;
  farmerId: string;
  farmId: string;
  type: AdvisoryType;
  title?: string;
  recommendation: string;
  confidence: number;
  createdAt: number;
  viewed: boolean;
  actionItems?: string[];
  fertilizerPlan?: {
    ureaKgPerAcre: number;
    dapKgPerAcre: number;
    mopKgPerAcre: number;
  };
  irrigationNotice?: string;
}

export interface DiseaseScan {
  id: string;
  farmerId: string;
  imageUrl: string;
  disease: string;
  confidence: number;
  treatment: string;
  prevention?: string;
  chemicalRemedy?: string;
  organicRemedy?: string;
  affectedCrop?: string;
  pathogenType?: "Fungal" | "Bacterial" | "Viral" | "Pest" | "Nutritional";
  severity?: "Mild" | "Moderate" | "Severe";
  audioExplanationUrl?: string;
  createdAt: number;
}

export interface StateApiConfig {
  id: string;
  stateName: string;
  apiKey: string;
  contactEmail: string;
  rateLimit: number; // req/min
  usageCount: number;
  createdAt: number;
  lastUsed: number;
  status: "active" | "suspended" | "revoked";
  allowedScopes: string[];
}

export interface WeatherDayForecast {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  humidity: number;
  precipitationChance: number;
  weatherCondition: string;
  icon: string;
  agriSpraySuitability: "Optimal" | "Caution" | "Avoid";
}

export interface HyperlocalWeather {
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    pressure: number;
    uvIndex: number;
    condition: string;
    icon: string;
    lastUpdated: string;
    sprayWindowStatus: string;
  };
  forecast: WeatherDayForecast[];
  advisory: string;
}

export interface SatelliteObservation {
  timestamp: string;
  ndvi: number;
  soilMoisture: number; // Percentage
  surfaceTemp: number; // Celsius
  cropHealthStatus: "Vigorous" | "Normal" | "Stressed" | "Sparse";
  vegetationIndexSummary: string;
  imageUrl?: string;
}

export interface RegenerativePlan {
  soilOrganicCarbon: number;
  climateResilienceScore: number;
  carbonCreditsEstimated: number; // credits/acre
  estimatedIncentiveINR: number;
  cropRotationSequence: Array<{
    season: string;
    crop: string;
    benefits: string;
    nitrogenFixationRating: string;
  }>;
  eligibleGovernmentSchemes: Array<{
    name: string;
    subsidyAmount: string;
    description: string;
    applyLink: string;
  }>;
}
