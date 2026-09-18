import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get("lat") || "30.901");
    const lng = parseFloat(searchParams.get("lng") || "75.857");

    // Dynamic temperature and weather pattern based on latitude
    const baseTemp = Math.round(28 + Math.sin(lat) * 4);

    const weatherData = {
      coordinates: { latitude: lat, longitude: lng },
      current: {
        temp: baseTemp,
        feelsLike: baseTemp + 2,
        humidity: 58,
        windSpeed: 12,
        windDirection: "NW",
        pressure: 1012,
        uvIndex: 6,
        condition: "Partly Cloudy",
        icon: "partly-cloudy",
        lastUpdated: new Date().toLocaleTimeString(),
        sprayWindowStatus: "Optimal for Fungicide Spray (Low Wind)",
      },
      forecast: [
        {
          date: "Today",
          dayName: "Fri",
          tempMax: baseTemp + 3,
          tempMin: baseTemp - 8,
          humidity: 55,
          precipitationChance: 10,
          weatherCondition: "Clear",
          icon: "sun",
          agriSpraySuitability: "Optimal",
        },
        {
          date: "Tomorrow",
          dayName: "Sat",
          tempMax: baseTemp + 4,
          tempMin: baseTemp - 7,
          humidity: 60,
          precipitationChance: 15,
          weatherCondition: "Sunny",
          icon: "sun",
          agriSpraySuitability: "Optimal",
        },
        {
          date: "Day 3",
          dayName: "Sun",
          tempMax: baseTemp + 1,
          tempMin: baseTemp - 9,
          humidity: 75,
          precipitationChance: 65,
          weatherCondition: "Scattered Rain",
          icon: "rain",
          agriSpraySuitability: "Avoid",
        },
        {
          date: "Day 4",
          dayName: "Mon",
          tempMax: baseTemp - 1,
          tempMin: baseTemp - 10,
          humidity: 82,
          precipitationChance: 70,
          weatherCondition: "Thunderstorm",
          icon: "rain",
          agriSpraySuitability: "Avoid",
        },
        {
          date: "Day 5",
          dayName: "Tue",
          tempMax: baseTemp + 1,
          tempMin: baseTemp - 9,
          humidity: 65,
          precipitationChance: 25,
          weatherCondition: "Partly Cloudy",
          icon: "partly-cloudy",
          agriSpraySuitability: "Caution",
        },
        {
          date: "Day 6",
          dayName: "Wed",
          tempMax: baseTemp + 2,
          tempMin: baseTemp - 8,
          humidity: 56,
          precipitationChance: 10,
          weatherCondition: "Sunny",
          icon: "sun",
          agriSpraySuitability: "Optimal",
        },
        {
          date: "Day 7",
          dayName: "Thu",
          tempMax: baseTemp + 3,
          tempMin: baseTemp - 7,
          humidity: 52,
          precipitationChance: 5,
          weatherCondition: "Clear",
          icon: "sun",
          agriSpraySuitability: "Optimal",
        },
      ],
      advisory:
        "Favorable weather conditions today and tomorrow. Execute pending foliar micronutrient and herbicide sprays before the Sunday rain system.",
    };

    return NextResponse.json(weatherData);
  } catch (error: any) {
    console.error("API weather error:", error);
    return NextResponse.json({ error: "Failed to fetch weather data." }, { status: 500 });
  }
}
