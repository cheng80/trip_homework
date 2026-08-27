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
