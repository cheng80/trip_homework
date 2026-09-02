/**
 * 역할: 이미지 선택 미리보기 목록을 기존 첨부 이미지와 구분합니다.
 * 처리 흐름: 기존 이미지와 새로 고른 파일을 합쳐 최대 4장까지 미리봅니다.
 * 주의사항: 한 번에 고른 파일이 남은 칸을 넘으면 오류를 내고 기존 선택은 유지합니다.
 */
export type ImagePreview = { src: string; alt: string };

export const maxImageCount = 4;

export type ImageSelection = {
  files: File[];
  urls: string[];
  error: string | null;
};

function isFilledFile(file: File) {
  return file.size > 0;
}

export function remainingImageSlots(currentCount: number) {
  return Math.max(0, maxImageCount - currentCount);
}

export function appendSelectedImages(current: File[], incoming: File[]): ImageSelection {
  const nextFiles = incoming.filter(isFilledFile);
  const remaining = remainingImageSlots(current.length);

  if (nextFiles.length === 0) {
    return { files: current, urls: [], error: null };
  }
  if (nextFiles.length > remaining) {
    return {
      files: current,
      urls: [],
      error: remaining
        ? `사진은 최대 ${maxImageCount}장까지 첨부할 수 있습니다. ${remaining}장만 더 추가할 수 있습니다.`
        : `사진은 최대 ${maxImageCount}장까지 첨부할 수 있습니다.`,
    };
  }

  return {
    files: [...current, ...nextFiles],
    urls: nextFiles.map((file) => URL.createObjectURL(file)),
    error: null,
  };
}

export function createSelectedImagePreviewUrls(files: File[]) {
  return files.filter(isFilledFile).map((file) => URL.createObjectURL(file));
}

export function revokeImagePreviewUrls(urls: string[]) {
  for (const url of urls) {
    if (url.startsWith("blob:")) URL.revokeObjectURL(url);
  }
}

export function resolveImagePreviews(existing: ImagePreview[], selectedUrls: string[]): ImagePreview[] {
  const added = selectedUrls.map((src, index) => ({ src, alt: `선택한 사진 ${existing.length + index + 1}` }));
  return [...existing, ...added];
}

export function removeSelectedImage(files: File[], urls: string[], index: number) {
  return {
    files: files.filter((_, current) => current !== index),
    urls: urls.filter((_, current) => current !== index),
    removedUrl: urls[index],
  };
}
