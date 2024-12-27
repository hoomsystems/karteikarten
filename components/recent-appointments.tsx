import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function RecentAppointments() {
  // Aquí normalmente cargaríamos las citas desde Supabase
  const appointments = [
    {
      id: "1",
      client: {
        name: "Olivia Martín",
        email: "olivia@example.com",
      },
      service: "Corte de cabello",
      date: "2024-03-20T10:00:00",
      status: "confirmed"
    },
    {
      id: "2",
      client: {
        name: "Sofia García",
        email: "sofia@example.com",
      },
      service: "Tinte",
      date: "2024-03-20T11:30:00",
      status: "pending"
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Citas Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  {appointment.client.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {appointment.client.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {appointment.service}
                </p>
              </div>
              <div className="ml-auto font-medium">
                {new Date(appointment.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}