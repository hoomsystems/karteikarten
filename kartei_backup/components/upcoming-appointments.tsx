import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function UpcomingAppointments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between space-x-4"
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={appointment.avatar} />
                  <AvatarFallback>
                    {appointment.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {appointment.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.service}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {appointment.time}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const appointments = [
  {
    id: 1,
    name: "Sarah Johnson",
    service: "Haircut & Style",
    time: "2:00 PM",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    name: "Michael Chen",
    service: "Color Treatment",
    time: "3:30 PM",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    name: "Emma Davis",
    service: "Blowout",
    time: "4:45 PM",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

