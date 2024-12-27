import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ClientList } from "@/components/client-list"

export default function ClientsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Clientes"
        text="Administra los clientes de tu salón."
      />
      <ClientList />
    </DashboardShell>
  )
}

