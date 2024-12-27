import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ClientDetails } from "@/components/client-details"

export default function ClientDetailsPage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Client Details"
        text={`View client information and appointment history.`}
      />
      <ClientDetails clientId={params.id} />
    </DashboardShell>
  )
}

