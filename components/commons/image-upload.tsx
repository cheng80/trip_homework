/**
 * 역할: 게시글과 상품 폼에서 공유하는 다중 이미지 선택 컴포넌트입니다.
 * 처리 흐름: 기존 이미지 뒤에 새 파일을 누적하고 최대 4장까지만 미리봅니다.
 * 주의사항: 고른 파일은 DataTransfer로 input에 다시 넣어 제출 시 누적 파일이 전달되게 합니다.
 */
"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  appendSelectedImages,
  maxImageCount,
  removeSelectedImage,
  resolveImagePreviews,
  revokeImagePreviewUrls,
  type ImagePreview,
} from "@/domain/image-preview";
import styles from "./image-upload.module.css";

type ImageUploadProps = {
  previews?: ImagePreview[];
  onError?: (message: string) => void;
};

function previewSrc(src: string) {
  if (src.startsWith("http") || src.startsWith("/") || src.startsWith("blob:")) return src;
  return `https://storage.googleapis.com/${src}`;
}

export default function ImageUpload({ previews = [], onError }: ImageUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const visiblePreviews = resolveImagePreviews(previews, selectedUrls);

  useEffect(() => () => revokeImagePreviewUrls(selectedUrls), [selectedUrls]);

  const syncInputFiles = (nextFiles: File[]) => {
    const input = inputRef.current;
    if (!input) return;

    const transfer = new DataTransfer();
    nextFiles.forEach((file) => transfer.items.add(file));
    input.files = transfer.files;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(event.currentTarget.files ?? []);
    const next = appendSelectedImages(files, incoming);

    if (next.error) {
      syncInputFiles(files);
      onError?.(next.error);
      window.alert(next.error);
      return;
    }

    onError?.("");
    setFiles(next.files);
    setSelectedUrls((current) => [...current, ...next.urls]);
    syncInputFiles(next.files);
  };

  const handleRemove = (index: number) => {
    const selectedIndex = index - previews.length;
    if (selectedIndex < 0) return;

    const next = removeSelectedImage(files, selectedUrls, selectedIndex);
    if (next.removedUrl) revokeImagePreviewUrls([next.removedUrl]);
    onError?.("");
    setFiles(next.files);
    setSelectedUrls(next.urls);
    syncInputFiles(next.files);
  };

  return (
    <div className={styles.uploadArea}>
      <label className={styles.uploadButton} htmlFor="images">
        <Image src="/icon/outline/add.svg" alt="" width={28} height={28} />
        <span>사진 추가</span>
        <small>{visiblePreviews.length}/{maxImageCount}장</small>
      </label>
      <input
        ref={inputRef}
        className={styles.fileInput}
        id="images"
        name="images"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        onChange={handleChange}
      />

      {visiblePreviews.map((preview, index) => (
        <div className={styles.preview} key={preview.src}>
          {preview.src.startsWith("blob:") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview.src} alt={preview.alt} />
          ) : (
            <Image
              src={previewSrc(preview.src)}
              alt={preview.alt}
              fill
              sizes="160px"
              loading={index === 0 ? "eager" : "lazy"}
            />
          )}
          {index >= previews.length && (
            <button
              className={styles.removeButton}
              type="button"
              onClick={() => handleRemove(index)}
              aria-label={`${preview.alt} 삭제`}
            >
              삭제
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
