import TravelProductForm from "@/components/travelproducts/travel-product-form";
import { sanitizeRichText } from "@/domain/sanitize-rich-text";
import { requireAuthSession } from "@/services/server-auth";
import { getTravelproductForm } from "@/services/travel-products";

type EditTravelProductPageProps = {
  params: Promise<{ travelproductId: string }>;
};

export default async function EditTravelProductPage({ params }: EditTravelProductPageProps) {
  await requireAuthSession();
  const { travelproductId } = await params;
  const initialValues = await getTravelproductForm(travelproductId);

  return (
    <TravelProductForm
      mode="edit"
      productId={travelproductId}
      initialValues={{ ...initialValues, description: sanitizeRichText(initialValues.description) }}
    />
  );
}
