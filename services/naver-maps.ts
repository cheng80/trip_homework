/**
 * 역할: NAVER Geocoding API를 서버에서 호출해 주소를 위도·경도로 변환합니다.
 * 처리 흐름: 상세 주소부터 넓은 후보까지 순차 조회하고 첫 성공 좌표를 반환합니다.
 * 주의사항: 인증키가 없거나 모든 조회가 실패하면 예외 대신 undefined를 반환해 상세 화면을 유지합니다.
 */
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
