import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentClients() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Clients</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {recentClients.map((client) => (
            <Link
              key={client.id}
              href={`/clients/${client.id}`}
              className="flex items-center justify-between space-x-4 hover:bg-muted p-2 rounded-md transition-colors"
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={client.avatar} />
                  <AvatarFallback>
                    {client.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {client.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {client.lastService}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {client.lastVisit}
              </p>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const recentClients = [
  {
    id: 1,
    name: "Sarah Johnson",
    lastService: "Haircut & Style",
    lastVisit: "2 days ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    name: "Michael Chen",
    lastService: "Color Treatment",
    lastVisit: "1 week ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    name: "Emma Davis",
    lastService: "Blowout",
    lastVisit: "3 days ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

