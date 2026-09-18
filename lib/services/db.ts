// Database service layer with Firestore integration, optimistic caching, and offline support
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { UserProfile, Farm, Advisory, DiseaseScan, StateApiConfig } from "@/types";

// Seed data for offline/demo operation
export const DEMO_USERS: UserProfile[] = [
  {
    uid: "demo-farmer-01",
    name: "Gurvinder Singh (ਗੁਰਵਿੰਦਰ ਸਿੰਘ)",
    phone: "+91 98765 43210",
    email: "gurvinder.farmer@krishibuddy.in",
    language: "pa",
    role: "farmer",
    state: "Punjab",
    district: "Ludhiana",
    createdAt: Date.now() - 30 * 86400000,
    lastLogin: Date.now(),
    avatarUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80",
  },
  {
    uid: "demo-admin-01",
    name: "Dr. Vandana Rao (ICAR Chief Scientist)",
    phone: "+91 98111 22334",
    email: "vandana.icar@gov.in",
    language: "hi",
    role: "admin",
    state: "Delhi",
    district: "New Delhi",
    createdAt: Date.now() - 90 * 86400000,
    lastLogin: Date.now(),
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  },
  {
    uid: "demo-state-01",
    name: "Hardeep Singh (Director, Dept of Agri Punjab)",
    phone: "+91 98222 33445",
    email: "director.agri@punjab.gov.in",
    language: "en",
    role: "state_official",
    state: "Punjab",
    district: "Chandigarh",
    createdAt: Date.now() - 60 * 86400000,
    lastLogin: Date.now(),
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
];

export const DEMO_FARMS: Farm[] = [
  {
    id: "farm-ludhiana-01",
    farmerId: "demo-farmer-01",
    name: "Green Harvest Acres (ਹਰਾ ਇਨਕਲਾਬ ਫਾਰਮ)",
    location: { latitude: 30.901, longitude: 75.8573 },
    area: 4.8,
    soilType: "Alluvial Loam (ਜਲੋਢ ਮਿੱਟੀ)",
    crops: [
      { name: "Wheat (ਕਣਕ - PBW 824)", season: "Rabi", sowingDate: "2025-11-05" },
      { name: "Mustard (ਸਰ੍ਹੋਂ)", season: "Rabi", sowingDate: "2025-10-20" },
    ],
    boundary: [
      { latitude: 30.9035, longitude: 75.855 },
      { latitude: 30.904, longitude: 75.861 },
      { latitude: 30.898, longitude: 75.862 },
      { latitude: 30.8975, longitude: 75.856 },
    ],
    soilHealth: {
      nitrogen: 245,
      phosphorus: 48,
      potassium: 195,
      ph: 7.2,
      organicCarbon: 0.68,
    },
    ndviScore: 0.78,
    createdAt: Date.now() - 45 * 86400000,
  },
];

export const DEMO_ADVISORIES: Advisory[] = [
  {
    id: "adv-01",
    farmerId: "demo-farmer-01",
    farmId: "farm-ludhiana-01",
    type: "crop",
    title: "Second Irrigation & Top-Dress Urea Timing",
    recommendation: "Wheat crop is entering active tillering (CRI stage). Apply 35 kg Urea per acre followed by light irrigation. Avoid over-watering to prevent yellow rust initiation.",
    confidence: 94.5,
    createdAt: Date.now() - 2 * 86400000,
    viewed: false,
    actionItems: [
      "Top dress 35 kg Neem-coated Urea",
      "Ensure 3-4 cm standing water drainage within 24h",
      "Inspect lower leaf sheaths for fungal spots",
    ],
    fertilizerPlan: {
      ureaKgPerAcre: 35,
      dapKgPerAcre: 0,
      mopKgPerAcre: 10,
    },
    irrigationNotice: "Optimal window: Tomorrow morning before 10 AM",
  },
  {
    id: "adv-02",
    farmerId: "demo-farmer-01",
    farmId: "farm-ludhiana-01",
    type: "weather",
    title: "Light Rain Alert - Postpone Spraying",
    recommendation: "Hyperlocal radar indicates 65% chance of light showers with wind gusts up to 22 km/h over Ludhiana on Thursday. Hold all foliar chemical applications.",
    confidence: 91.0,
    createdAt: Date.now() - 5 * 86400000,
    viewed: true,
  },
  {
    id: "adv-03",
    farmerId: "demo-farmer-01",
    farmId: "farm-ludhiana-01",
    type: "soil",
    title: "Soil Potassium Replenishment Recommendation",
    recommendation: "Soil test analysis indicates slight potassium deficit (195 kg/ha). Apply 15 kg MOP during next basal dressing to fortify wheat stalk strength and drought resilience.",
    confidence: 89.2,
    createdAt: Date.now() - 12 * 86400000,
    viewed: true,
  },
];

export const DEMO_DISEASE_SCANS: DiseaseScan[] = [
  {
    id: "scan-01",
    farmerId: "demo-farmer-01",
    imageUrl: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&auto=format&fit=crop&q=80",
    disease: "Tomato Early Blight (Alternaria solani)",
    confidence: 96.8,
    treatment: "Apply Copper Oxychloride 50 WP @ 3g/L or Mancozeb 75 WP @ 2.5g/L water at 10-day intervals.",
    organicRemedy: "Foliar spray of 5% Neem seed kernel extract (NSKE) or Trichoderma viride culture.",
    chemicalRemedy: "Chlorothalonil or Azoxystrobin spray during evening hours.",
    prevention: "Prune bottom leaves touching the soil. Practice 3-year solanaceous crop rotation.",
    pathogenType: "Fungal",
    severity: "Moderate",
    affectedCrop: "Tomato",
    createdAt: Date.now() - 1 * 86400000,
  },
  {
    id: "scan-02",
    farmerId: "demo-farmer-01",
    imageUrl: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&auto=format&fit=crop&q=80",
    disease: "Wheat Yellow Rust (Puccinia striiformis)",
    confidence: 93.4,
    treatment: "Spray Propiconazole 25% EC (Tilt) @ 1 ml per liter of water immediately upon detection of yellow pustules.",
    organicRemedy: "Sour buttermilk fermented spray (10%) + garlic-chili extract.",
    chemicalRemedy: "Tebuconazole 25.9% EC @ 1ml/L.",
    prevention: "Plant resistant cultivars such as PBW 824 and DBW 303. Avoid high nitrogen surplus in fog.",
    pathogenType: "Fungal",
    severity: "Mild",
    affectedCrop: "Wheat",
    createdAt: Date.now() - 7 * 86400000,
  },
];

export const DEMO_STATE_APIS: StateApiConfig[] = [
  {
    id: "state-pb-01",
    stateName: "Punjab",
    apiKey: "kb_live_pb_994a38f17e0892bcd31",
    contactEmail: "agri.director@punjab.gov.in",
    rateLimit: 1200,
    usageCount: 48920,
    createdAt: Date.now() - 45 * 86400000,
    lastUsed: Date.now() - 1200000,
    status: "active",
    allowedScopes: ["farms.read", "advisory.write", "soil.sync", "agristack.idea"],
  },
  {
    id: "state-mh-01",
    stateName: "Maharashtra",
    apiKey: "kb_live_mh_771c55e92d4431fef80",
    contactEmail: "krishi.commissioner@maharashtra.gov.in",
    rateLimit: 1500,
    usageCount: 82140,
    createdAt: Date.now() - 60 * 86400000,
    lastUsed: Date.now() - 3600000,
    status: "active",
    allowedScopes: ["farms.read", "disease.read", "satellite.ndvi", "agristack.idea"],
  },
];

// Helper functions for local caching
function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(`krishi_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`krishi_${key}`, JSON.stringify(value));
  } catch (err) {
    console.error("Local storage error:", err);
  }
}

// Service Methods
export const dbService = {
  // Users
  async getUser(uid: string): Promise<UserProfile | null> {
    const users = getLocal<UserProfile[]>("users", DEMO_USERS);
    const found = users.find((u) => u.uid === uid);
    if (found) return found;

    if (db) {
      try {
        const docRef = doc(db, "users", uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          return snap.data() as UserProfile;
        }
      } catch (err) {
        console.warn("Firestore getUser fallback to local:", err);
      }
    }
    return null;
  },

  async saveUser(user: UserProfile): Promise<void> {
    const users = getLocal<UserProfile[]>("users", DEMO_USERS);
    const idx = users.findIndex((u) => u.uid === user.uid);
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    setLocal("users", users);

    if (db) {
      try {
        await setDoc(doc(db, "users", user.uid), user, { merge: true });
      } catch (err) {
        console.warn("Firestore saveUser fallback to local cache:", err);
      }
    }
  },

  // Farms
  async getFarms(farmerId: string): Promise<Farm[]> {
    const farms = getLocal<Farm[]>("farms", DEMO_FARMS);
    const filtered = farms.filter((f) => f.farmerId === farmerId);

    if (db) {
      try {
        const q = query(collection(db, "farms"), where("farmerId", "==", farmerId));
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Farm));
        }
      } catch (err) {
        console.warn("Firestore getFarms fallback to local:", err);
      }
    }
    return filtered.length ? filtered : DEMO_FARMS;
  },

  // Advisories
  async getAdvisories(farmerId: string): Promise<Advisory[]> {
    const advisories = getLocal<Advisory[]>("advisories", DEMO_ADVISORIES);
    const filtered = advisories.filter((a) => a.farmerId === farmerId);

    if (db) {
      try {
        const q = query(
          collection(db, "advisories"),
          where("farmerId", "==", farmerId),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Advisory));
        }
      } catch (err) {
        console.warn("Firestore getAdvisories fallback to local:", err);
      }
    }
    return filtered.length ? filtered : DEMO_ADVISORIES;
  },

  async addAdvisory(advisory: Omit<Advisory, "id">): Promise<Advisory> {
    const newAdvisory: Advisory = {
      ...advisory,
      id: `adv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    const list = getLocal<Advisory[]>("advisories", DEMO_ADVISORIES);
    list.unshift(newAdvisory);
    setLocal("advisories", list);

    if (db) {
      try {
        await addDoc(collection(db, "advisories"), newAdvisory);
      } catch (err) {
        console.warn("Firestore addAdvisory fallback to local:", err);
      }
    }
    return newAdvisory;
  },

  // Disease Scans
  async getDiseaseScans(farmerId: string): Promise<DiseaseScan[]> {
    const scans = getLocal<DiseaseScan[]>("disease_scans", DEMO_DISEASE_SCANS);
    const filtered = scans.filter((s) => s.farmerId === farmerId);

    if (db) {
      try {
        const q = query(
          collection(db, "disease_scans"),
          where("farmerId", "==", farmerId),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs.map((d) => ({ id: d.id, ...d.data() } as DiseaseScan));
        }
      } catch (err) {
        console.warn("Firestore getDiseaseScans fallback to local:", err);
      }
    }
    return filtered.length ? filtered : DEMO_DISEASE_SCANS;
  },

  async saveDiseaseScan(scan: Omit<DiseaseScan, "id">): Promise<DiseaseScan> {
    const newScan: DiseaseScan = {
      ...scan,
      id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    const list = getLocal<DiseaseScan[]>("disease_scans", DEMO_DISEASE_SCANS);
    list.unshift(newScan);
    setLocal("disease_scans", list);

    if (db) {
      try {
        await addDoc(collection(db, "disease_scans"), newScan);
      } catch (err) {
        console.warn("Firestore saveDiseaseScan fallback to local:", err);
      }
    }
    return newScan;
  },

  // State APIs
  async getStateApis(): Promise<StateApiConfig[]> {
    const apis = getLocal<StateApiConfig[]>("state_apis", DEMO_STATE_APIS);
    return apis;
  },

  async registerStateApi(entry: Omit<StateApiConfig, "id" | "apiKey" | "createdAt" | "lastUsed" | "usageCount">): Promise<StateApiConfig> {
    const randomHex = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const newKey: StateApiConfig = {
      ...entry,
      id: `state-${Date.now()}`,
      apiKey: `kb_live_${entry.stateName.toLowerCase().slice(0, 2)}_${randomHex}`,
      usageCount: 0,
      createdAt: Date.now(),
      lastUsed: Date.now(),
    };
    const list = getLocal<StateApiConfig[]>("state_apis", DEMO_STATE_APIS);
    list.unshift(newKey);
    setLocal("state_apis", list);

    if (db) {
      try {
        await addDoc(collection(db, "state_apis"), newKey);
      } catch (err) {
        console.warn("Firestore registerStateApi fallback to local:", err);
      }
    }
    return newKey;
  },
};
