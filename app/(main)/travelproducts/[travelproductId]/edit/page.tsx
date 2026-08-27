import TravelProductForm from "@/components/travelproducts/travel-product-form";
import { getTravelproductForm } from "@/services/travel-products";

type EditTravelProductPageProps = {
  params: Promise<{ travelproductId: string }>;
};

export default async function EditTravelProductPage({ params }: EditTravelProductPageProps) {
  const { travelproductId } = await params;
  const initialValues = await getTravelproductForm(travelproductId);

  return <TravelProductForm mode="edit" productId={travelproductId} initialValues={initialValues} />;
}
