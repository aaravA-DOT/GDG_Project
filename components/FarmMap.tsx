"use client";

import React, { useEffect, useRef, useState } from "react";
import { Farm } from "@/types";
import { Layers, MapPin, Eye, Info, Sparkles, Check } from "lucide-react";

interface FarmMapProps {
  farm: Farm;
  height?: string;
}

export default function FarmMap({ farm, height = "400px" }: FarmMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const polygonLayerRef = useRef<any>(null);
  const ndviLayerRef = useRef<any>(null);

  const [activeLayer, setActiveLayer] = useState<"standard" | "ndvi" | "moisture">("standard");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapContainerRef.current) return;

    let isMounted = true;

    // Dynamically import Leaflet on client side
    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous instance if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Default icon fix for leaflet in Next.js bundlers
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const centerLat = farm.location.latitude;
      const centerLng = farm.location.longitude;

      // Initialize map
      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 16,
        scrollWheelZoom: false,
      });

      mapInstanceRef.current = map;

      // OpenStreetMap Tile Layer
      const baseTile = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Farm Plot Boundary Polygon
      const polygonCoords = farm.boundary.map((pt) => [pt.latitude, pt.longitude] as [number, number]);
      
      const polygon = L.polygon(polygonCoords, {
        color: "#10B981",
        weight: 3,
        fillColor: "#10B981",
        fillOpacity: 0.25,
        dashArray: "6, 6",
      }).addTo(map);

      polygonLayerRef.current = polygon;

      // Center Marker with custom popup
      const marker = L.marker([centerLat, centerLng]).addTo(map);
      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px;">
          <h4 style="margin: 0; font-weight: bold; color: #10B981; font-size: 14px;">${farm.name}</h4>
          <p style="margin: 4px 0 2px; font-size: 12px; color: #e2e8f0;">Area: <b>${farm.area} Acres</b></p>
          <p style="margin: 0 0 4px; font-size: 12px; color: #cbd5e1;">Soil: <b>${farm.soilType}</b></p>
          <div style="font-size: 11px; color: #34d399; border-top: 1px solid rgba(16,185,129,0.3); padding-top: 4px; margin-top: 4px;">
            🌾 Active: ${farm.crops.map((c) => c.name).join(", ")}
          </div>
        </div>
      `);

      // Fit bounds to polygon
      map.fitBounds(polygon.getBounds(), { padding: [30, 30] });
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [farm, isClient]);

  // Handle Layer Toggle Effects
  useEffect(() => {
    if (!polygonLayerRef.current) return;

    if (activeLayer === "ndvi") {
      polygonLayerRef.current.setStyle({
        color: "#059669",
        fillColor: "#10B981",
        fillOpacity: 0.65,
      });
    } else if (activeLayer === "moisture") {
      polygonLayerRef.current.setStyle({
        color: "#2563EB",
        fillColor: "#3B82F6",
        fillOpacity: 0.55,
      });
    } else {
      polygonLayerRef.current.setStyle({
        color: "#10B981",
        fillColor: "#10B981",
        fillOpacity: 0.25,
      });
    }
  }, [activeLayer]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200/80 dark:border-emerald-950/60 shadow-lg">
      {/* Interactive Layer Switcher Bar */}
      <div className="absolute top-3 right-3 z-[400] flex items-center gap-1.5 p-1 bg-white/90 dark:bg-[#07140f]/90 backdrop-blur-md rounded-xl border border-slate-200/80 dark:border-emerald-950/60 shadow-md">
        <button
          type="button"
          onClick={() => setActiveLayer("standard")}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
            activeLayer === "standard"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Plot Boundary
        </button>
        <button
          type="button"
          onClick={() => setActiveLayer("ndvi")}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
            activeLayer === "ndvi"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Sparkles className="w-3 h-3 text-emerald-300" />
          <span>NDVI ({farm.ndviScore || 0.78})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveLayer("moisture")}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
            activeLayer === "moisture"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Soil Moisture (32%)
        </button>
      </div>

      {/* Farm Stats Badge overlay */}
      <div className="absolute bottom-3 left-3 z-[400] bg-white/90 dark:bg-[#07140f]/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200/80 dark:border-emerald-950/60 shadow-md flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
          <MapPin className="w-4 h-4" />
          <span>{farm.name}</span>
        </div>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <span className="text-slate-600 dark:text-slate-400">{farm.area} Acres</span>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <span className="text-slate-600 dark:text-slate-400">
          Lat: {farm.location.latitude.toFixed(3)}, Lng: {farm.location.longitude.toFixed(3)}
        </span>
      </div>

      {/* Leaflet DOM Node Container */}
      <div
        ref={mapContainerRef}
        style={{ height }}
        className="w-full bg-slate-100 dark:bg-[#061710] min-h-[300px]"
      >
        {!isClient && (
          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
            Initializing Leaflet Geospatial View...
          </div>
        )}
      </div>
    </div>
  );
}
