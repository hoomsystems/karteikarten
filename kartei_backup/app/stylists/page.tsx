import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { StylistsList } from "@/components/stylists-list"
import { AddStylistForm } from "@/components/add-stylist-form"

export default function StylistsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Stylists"
        text="Manage your salon's stylists and staff."
      />
      <div className="grid gap-8">
        <AddStylistForm />
        <StylistsList />
      </div>
    </DashboardShell>
  )
}

