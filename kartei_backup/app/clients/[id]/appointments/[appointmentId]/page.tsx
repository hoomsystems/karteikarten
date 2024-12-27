import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { AppointmentDetails } from "@/components/appointment-details"

export default function AppointmentDetailsPage({ params }: { params: { id: string, appointmentId: string } }) {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Appointment Details"
        text={`View appointment information.`}
      />
      <AppointmentDetails clientId={params.id} appointmentId={params.appointmentId} />
    </DashboardShell>
  )
}

