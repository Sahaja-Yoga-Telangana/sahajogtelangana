import CentersClient from "@/components/CentersClient";
import { getPublicCenters } from "@/lib/centers";

export const revalidate = 60;

export default async function Page() {
  const initialCenters = await getPublicCenters();

  return (
    <div className="bg-[color:var(--bg)] pb-12 text-[color:var(--ink)]">
      <CentersClient initialCenters={initialCenters} />
    </div>
  );
}
