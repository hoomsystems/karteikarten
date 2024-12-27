import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ClientList } from "@/components/client-list"

export default function ClientsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Clients"
        text="View and manage your salon's clients."
      />
      <ClientList />
    </DashboardShell>
  )
}

