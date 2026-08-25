import TravelProductForm from "@/components/travelproducts/travel-product-form";
import { travelProductFormValues } from "@/data/travel-products";

export default function EditTravelProductPage() {
  return <TravelProductForm mode="edit" initialValues={travelProductFormValues} />;
}
