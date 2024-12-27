import { RecentClients } from "@/components/recent-clients"
import { RecentAppointments } from "@/components/recent-appointments"

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Resumen de tu actividad reciente
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <RecentClients />
        <RecentAppointments />
      </div>
    </div>
  )
}

