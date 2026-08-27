import { notFound } from "next/navigation";
import ApiTestPage from "@/components/dev/api-test-page";

export default function DevApiTestPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <ApiTestPage />;
}
