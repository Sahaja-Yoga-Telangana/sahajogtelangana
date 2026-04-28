import CentersClient from "@/components/CentersClient";
import { getPublicCenters } from "@/lib/centers";

export const revalidate = 60;

export default async function Page() {
  const initialCenters = await getPublicCenters();

  return (
    <div className="page-container bg-[color:var(--bg)] pb-6 text-[color:var(--ink)] lg:px-20">
      <CentersClient initialCenters={initialCenters} />
    </div>
  );
}
