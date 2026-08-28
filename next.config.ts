/**
 * 역할: Next.js 빌드와 외부 이미지 최적화 허용 범위를 정의합니다.
 * 처리 흐름: 공용 GraphQL 저장소 등 신뢰한 원격 이미지 호스트만 Next Image가 처리하도록 제한합니다.
 * 주의사항: 환경별 비밀키나 런타임 데이터는 이 파일에 직접 넣지 않습니다.
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["172.16.1.108"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "storage.googleapis.com" }],
  },
};

export default nextConfig;
