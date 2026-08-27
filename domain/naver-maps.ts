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
