import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { AddClientForm } from "@/components/add-client-form"

export default function AddClientPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Add New Client"
        text="Enter the client's information to create a new profile."
      />
      <AddClientForm />
    </DashboardShell>
  )
}

