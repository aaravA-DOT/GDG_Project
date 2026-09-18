import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/services/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      stateName,
      contactEmail,
      rateLimit = 1000,
      allowedScopes = ["farms.read", "advisory.write", "soil.sync", "agristack.idea"],
    } = body;

    if (!stateName || !contactEmail) {
      return NextResponse.json(
        { error: "stateName and contactEmail are required." },
        { status: 400 }
      );
    }

    const stateKey = await dbService.registerStateApi({
      stateName,
      contactEmail,
      rateLimit,
      allowedScopes,
      status: "active",
    });

    return NextResponse.json({
      success: true,
      apiKey: stateKey.apiKey,
      stateName: stateKey.stateName,
      rateLimit: stateKey.rateLimit,
      allowedScopes: stateKey.allowedScopes,
      issuedAt: stateKey.createdAt,
      documentation: {
        openApiSpecUrl: "/api/state-api/openapi.json",
        authHeader: "Authorization: Bearer " + stateKey.apiKey,
        agristackVersion: "IDEA-1.2-Standard",
        endpoints: [
          { method: "GET", path: "/api/state/farms", description: "Fetch geo-referenced farm plots" },
          { method: "POST", path: "/api/state/advisory", description: "Publish state-wide pest advisories" },
          { method: "GET", path: "/api/state/soil-health", description: "Aggregate NPK telemetry data" },
        ],
      },
    });
  } catch (error: any) {
    console.error("API state-api error:", error);
    return NextResponse.json(
      { error: "Failed to generate state API credentials.", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const keys = await dbService.getStateApis();
    return NextResponse.json({
      totalStatesActive: keys.length,
      keys,
      agristackProtocol: "IDEA-v1.2",
      standard: "JSON-LD Agriculture Domain Ontology",
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to list state APIs." }, { status: 500 });
  }
}
