import { InscriptionsQueue } from "@/components/features/admin/inscriptions-queue";
import { listPendingInscriptions } from "@/server/admin/inscriptions";

export default async function InscriptionsAdminPage() {
  const inscriptions = await listPendingInscriptions();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Inscriptions en attente</h1>
      <InscriptionsQueue inscriptions={inscriptions} />
    </div>
  );
}
