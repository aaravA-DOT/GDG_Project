import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const farmId = searchParams.get("farmId") || "farm-ludhiana-01";

    const satelliteObservation = {
      farmId,
      constellation: "Sentinel-2 MultiSpectral Instrument (MSI)",
      revisitIntervalDays: 5,
      lastPassTimestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
      ndvi: 0.78,
      soilMoisture: 34.2, // Percentage volumetric
      surfaceTemp: 24.6, // Celsius
      cropHealthStatus: "Vigorous",
      vegetationIndexSummary:
        "High canopy density with optimal near-infrared reflectance. Chlorophyll absorption in red band indicates healthy nitrogen assimilation.",
      spectralBands: {
        B4_Red: 0.082,
        B8_NIR: 0.658,
        NDWI_WaterIndex: 0.22,
      },
    };

    return NextResponse.json(satelliteObservation);
  } catch (error: any) {
    console.error("API satellite-data error:", error);
    return NextResponse.json({ error: "Failed to fetch satellite remote sensing data." }, { status: 500 });
  }
}
