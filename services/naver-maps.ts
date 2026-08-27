import "server-only";
import { createGeocodeQueries, type MapCoordinates } from "@/domain/naver-maps";

type NaverGeocodeResponse = {
  status?: string;
  addresses?: Array<{ x?: string; y?: string }>;
};

export async function geocodeAddress(address: string): Promise<MapCoordinates | null> {
  const keyId = process.env.NEXT_PUBLIC_NAVER_MAPS_KEY_ID;
  const secretKey = process.env.NAVER_MAPS_SECRET_KEY;
  if (!keyId || !secretKey || !address.trim()) return null;

  try {
    for (const query of createGeocodeQueries(address)) {
      const url = new URL("https://maps.apigw.ntruss.com/map-geocode/v2/geocode");
      url.searchParams.set("query", query);
      url.searchParams.set("count", "1");

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "x-ncp-apigw-api-key-id": keyId,
          "x-ncp-apigw-api-key": secretKey,
        },
        cache: "force-cache",
        next: { revalidate: 60 * 60 * 24 * 30 },
      });
      if (!response.ok) return null;

      const data = await response.json() as NaverGeocodeResponse;
      if (data.status !== "OK") return null;

      const longitude = Number(data.addresses?.[0]?.x);
      const latitude = Number(data.addresses?.[0]?.y);
      if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
        return { latitude, longitude };
      }
    }

    return null;
  } catch {
    return null;
  }
}
