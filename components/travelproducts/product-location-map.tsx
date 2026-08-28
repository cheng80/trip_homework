/**
 * 역할: NAVER Dynamic Map을 지연 로드해 숙박권 위치를 표시하는 클라이언트 컴포넌트입니다.
 * 처리 흐름: 키와 좌표가 준비되면 지도 스크립트를 한 번만 불러오고 마커와 중심점을 설정합니다.
 * 주의사항: 지도 로드 실패나 키 누락 시 외부 지도 링크가 있는 대체 UI를 제공합니다.
 */
"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";
import { createNaverMapSearchUrl, type MapCoordinates } from "@/domain/naver-maps";
import styles from "./product-information.module.css";

type NaverMapsApi = {
  maps: {
    LatLng: new (latitude: number, longitude: number) => object;
    Map: new (element: HTMLElement, options: Record<string, unknown>) => object;
    Marker: new (options: Record<string, unknown>) => object;
  };
};

declare global {
  interface Window {
    naver?: NaverMapsApi;
  }
}

type ProductLocationMapProps = {
  address: string;
  coordinates: MapCoordinates | null;
};

export default function ProductLocationMap({ address, coordinates }: ProductLocationMapProps) {
  const mapElement = useRef<HTMLDivElement>(null);
  const keyId = process.env.NEXT_PUBLIC_NAVER_MAPS_KEY_ID;
  const mapUrl = createNaverMapSearchUrl(address);

  /**
   * SDK·좌표·DOM이 모두 준비된 경우에만 지도와 마커를 생성합니다.
   * 상세 위치 확인이 목적이므로 스크롤을 방해하는 지도 조작은 비활성화합니다.
   */
  const initializeMap = useCallback(() => {
    if (!coordinates || !mapElement.current || !window.naver) return;
    const center = new window.naver.maps.LatLng(coordinates.latitude, coordinates.longitude);
    const map = new window.naver.maps.Map(mapElement.current, {
      center,
      zoom: 16,
      draggable: false,
      scrollWheel: false,
      pinchZoom: false,
      keyboardShortcuts: false,
      disableDoubleClickZoom: true,
    });
    new window.naver.maps.Marker({ map, position: center });
  }, [coordinates]);

  useEffect(() => {
    // 다른 상세 화면에서 이미 SDK를 불러온 경우 Script의 onReady 없이 즉시 초기화합니다.
    if (window.naver) initializeMap();
  }, [initializeMap]);

  return (
    <>
      {keyId && coordinates && (
        <Script
          id="naver-maps-sdk"
          src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(keyId)}`}
          strategy="afterInteractive"
          onReady={initializeMap}
        />
      )}
      <a
        className={styles.mapLink}
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${address} 위치를 NAVER 지도에서 새 창으로 보기`}
      >
        <div className={styles.mapCanvas} ref={mapElement} aria-hidden="true" />
        <span className={styles.mapCaption}>NAVER 지도에서 보기 <span aria-hidden="true">↗</span></span>
      </a>
    </>
  );
}
