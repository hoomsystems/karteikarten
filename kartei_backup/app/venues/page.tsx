import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { VenuesList } from "@/components/venues-list"
import { AddVenueForm } from "@/components/add-venue-form"

export default function VenuesPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Venues"
        text="Manage your salon locations and venues."
      />
      <div className="grid gap-8">
        <AddVenueForm />
        <VenuesList />
      </div>
    </DashboardShell>
  )
}

