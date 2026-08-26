import Image from "next/image";
import SectionTitle from "@/components/commons/section-title";
import type { TravelProduct } from "@/types/travel-products";
import styles from "./featured-products.module.css";

type FeaturedProductsProps = {
  products: TravelProduct[];
};

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section aria-labelledby="season-title">
      <SectionTitle as="h1" id="season-title">
        2024 끝여름 낭만있게 마무리 하고 싶다면?
      </SectionTitle>
      <div className={styles.grid}>
        {products.slice(0, 2).map((product) => (
          <article className={styles.card} key={product.id}>
            <Image
              src={product.image}
              alt=""
              fill
              loading="eager"
              sizes="(max-width: 780px) 100vw, 50vw"
            />
            <div className={styles.content}>
              <strong>{product.location}: {product.title}</strong>
              <span>{product.price}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
