/**
 * 역할: 게시글과 상품 폼에서 공유하는 다중 이미지 선택 컴포넌트입니다.
 * 처리 흐름: 기존 이미지와 새 파일 미리보기를 합쳐 보여주고 파일 입력 이름을 폼 제출 구조에 맞춥니다.
 * 주의사항: 객체 URL은 변경과 언마운트 시 해제해 브라우저 메모리 누수를 막습니다.
 */
import Image from "next/image";
import styles from "./image-upload.module.css";

type ImageUploadProps = {
  previews?: Array<{ src: string; alt: string }>;
};

export default function ImageUpload({ previews = [] }: ImageUploadProps) {
  return (
    <div className={styles.uploadArea}>
      <label className={styles.uploadButton} htmlFor="images">
        <Image src="/icon/outline/add.svg" alt="" width={28} height={28} />
        <span>사진 추가</span>
        <small>최대 4장</small>
      </label>
      <input
        className={styles.fileInput}
        id="images"
        name="images"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
      />

      {previews.map((preview, index) => (
        <div className={styles.preview} key={preview.src}>
          <Image
            src={preview.src.startsWith("http") || preview.src.startsWith("/")
              ? preview.src
              : `https://storage.googleapis.com/${preview.src}`}
            alt={preview.alt}
            fill
            sizes="160px"
            loading={index === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}
    </div>
  );
}
