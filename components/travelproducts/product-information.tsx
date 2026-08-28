import Image from "next/image";
import RichTextContent from "@/components/commons/rich-text-content";
import type { MapCoordinates } from "@/domain/naver-maps";
import type { TravelProductDetailData } from "@/types/travel-products";
import ProductLocationMap from "./product-location-map";
import styles from "./product-information.module.css";

type ProductInformationProps = {
  product: TravelProductDetailData;
  coordinates: MapCoordinates | null;
};

export default function ProductInformation({ product, coordinates }: ProductInformationProps) {
  return (
    <>
      <section className={styles.section} aria-labelledby="description-title">
        <h2 id="description-title">숙박권 상세 정보</h2>
        <RichTextContent sanitizedHtml={product.description} />
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
        <ProductLocationMap address={product.location} coordinates={coordinates} />
      </section>
    </>
  );
}
