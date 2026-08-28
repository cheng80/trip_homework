/**
 * 역할: 주소 문자열을 NAVER 지도 검색 링크와 지오코딩 후보로 변환합니다.
 * 처리 흐름: 상세 주소부터 넓은 지역명까지 중복 없는 후보를 만들어 조회 성공 가능성을 높입니다.
 * 주의사항: 키나 네트워크에 의존하지 않는 순수 문자열 로직만 포함합니다.
 */
export type MapCoordinates = {
  latitude: number;
  longitude: number;
};

export function createNaverMapSearchUrl(address: string) {
  return `https://map.naver.com/p/search/${encodeURIComponent(address.trim())}`;
}

export function createGeocodeQueries(address: string) {
  const words = address.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  return Array.from(
    { length: Math.max(words.length - 1, 1) },
    (_, index) => words.slice(0, words.length - index).join(" "),
  );
}
