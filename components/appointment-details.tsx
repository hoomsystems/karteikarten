"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const appointments = [
  { 
    id: "1", 
    clientId: "1",
    date: "2023-05-15", 
    stylist: "John Doe",
    service: "Haircut",
    formulation: "N/A",
    treatments: "Deep conditioning",
    productsUsed: "Shampoo X, Conditioner Y",
    notes: "Client prefers shorter layers",
    clientDrink: "Water",
    conversationTopics: "Summer vacation plans",
    productsBought: "Hair serum",
    interestedInFollowUps: true
  },
  // Add more appointments as needed
]

export function AppointmentDetails({ clientId, appointmentId }: { clientId: string, appointmentId: string }) {
  const appointment = appointments.find(a => a.id === appointmentId && a.clientId === clientId)

  if (!appointment) {
    return <div>Appointment not found</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointment on {appointment.date}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="font-medium">Stylist</dt>
            <dd className="mt-1 text-muted-foreground">{appointment.stylist}</dd>
          </div>
          <div>
            <dt className="font-medium">Service</dt>
            <dd className="mt-1 text-muted-foreground">{appointment.service}</dd>
          </div>
          <div>
            <dt className="font-medium">Formulation</dt>
            <dd className="mt-1 text-muted-foreground">{appointment.formulation}</dd>
          </div>
          <div>
            <dt className="font-medium">Treatments</dt>
            <dd className="mt-1 text-muted-foreground">{appointment.treatments}</dd>
          </div>
          <div>
            <dt className="font-medium">Products Used</dt>
            <dd className="mt-1 text-muted-foreground">{appointment.productsUsed}</dd>
          </div>
          <div>
            <dt className="font-medium">Notes</dt>
            <dd className="mt-1 text-muted-foreground">{appointment.notes}</dd>
          </div>
          <div>
            <dt className="font-medium">Client's Drink</dt>
            <dd className="mt-1 text-muted-foreground">{appointment.clientDrink}</dd>
          </div>
          <div>
            <dt className="font-medium">Conversation Topics</dt>
            <dd className="mt-1 text-muted-foreground">{appointment.conversationTopics}</dd>
          </div>
          <div>
            <dt className="font-medium">Products Bought</dt>
            <dd className="mt-1 text-muted-foreground">{appointment.productsBought}</dd>
          </div>
          <div>
            <dt className="font-medium">Interested in Follow-ups</dt>
            <dd className="mt-1 text-muted-foreground">{appointment.interestedInFollowUps ? "Yes" : "No"}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}

