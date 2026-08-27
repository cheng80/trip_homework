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
