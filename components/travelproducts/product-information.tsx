import Image from "next/image";
import type { TravelProductDetailData } from "@/types/travel-products";
import styles from "./product-information.module.css";

type ProductInformationProps = {
  product: TravelProductDetailData;
};

export default function ProductInformation({ product }: ProductInformationProps) {
  return (
    <>
      <section className={styles.section} aria-labelledby="description-title">
        <h2 id="description-title">숙박권 상세 정보</h2>
        <p>{product.description}</p>
        <ul>
          {product.notes.map((note) => <li key={note}>{note}</li>)}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="location-title">
        <h2 id="location-title">상세 위치</h2>
        <div className={styles.address}>
          <Image src="/icon/outline/location.svg" alt="" width={24} height={24} />
          <div>
            <strong>{product.address}</strong>
            <p>{product.addressNote}</p>
          </div>
        </div>
        <div className={styles.map} role="img" aria-label={`${product.location} 숙소 위치를 나타내는 지도 자리`}>
          <span>{product.location} 숙소 위치</span>
        </div>
      </section>
    </>
  );
}
