"use client"

import Link from "next/link"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { AppointmentCard } from "@/components/appointment-card"

const clients = [
  { 
    id: "1", 
    name: "Sarah Johnson", 
    email: "sarah@example.com", 
    phone: "123-456-7890",
    appointments: [
      { id: 1, date: "2023-05-15", service: "Haircut & Style" },
      { id: 2, date: "2023-04-01", service: "Color Treatment" },
      { id: 3, date: "2023-03-15", service: "Blowout" },
    ]
  },
  { 
    id: "2", 
    name: "Michael Chen", 
    email: "michael@example.com", 
    phone: "987-654-3210",
    appointments: [
      { id: 1, date: "2023-05-10", service: "Color Treatment" },
      { id: 2, date: "2023-03-22", service: "Haircut" },
    ]
  },
  { 
    id: "3", 
    name: "Emma Davis", 
    email: "emma@example.com", 
    phone: "456-789-0123",
    appointments: [
      { id: 1, date: "2023-05-18", service: "Blowout" },
      { id: 2, date: "2023-04-05", service: "Haircut & Style" },
      { id: 3, date: "2023-02-28", service: "Color Treatment" },
    ]
  },
]

export function ClientDetails({ clientId }: { clientId: string }) {
  const [showNewAppointment, setShowNewAppointment] = useState(false)
  const client = clients.find(c => c.id === clientId)

  if (!client) {
    return <div>Client not found</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={`/placeholder.svg?height=80&width=80`} alt={client.name} />
              <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{client.name}</h2>
              <p className="text-muted-foreground">{client.email}</p>
              <p className="text-muted-foreground">{client.phone}</p>
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={() => setShowNewAppointment(true)}>
              Create New Appointment
            </Button>
          </div>
        </CardContent>
      </Card>

      {showNewAppointment && (
        <AppointmentCard clientName={client.name} onClose={() => setShowNewAppointment(false)} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Appointment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {client.appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.service}</TableCell>
                  <TableCell>
                    <Link href={`/clients/${clientId}/appointments/${appointment.id}`} className="text-primary hover:underline">
                      View Details
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

