import TravelProductForm from "@/components/travelproducts/travel-product-form";
import { requireAuthSession } from "@/services/server-auth";

export default async function NewTravelProductPage() {
  await requireAuthSession();
  return <TravelProductForm mode="create" />;
}
