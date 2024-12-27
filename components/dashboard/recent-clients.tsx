"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function RecentClients() {
  const [clients, setClients] = useState<any[]>([])
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const loadRecentClients = async () => {
      // Primero obtenemos las citas más recientes con los clientes
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select(`
          id,
          date,
          client_id,
          stylist_id,
          clients (
            id,
            first_name,
            last_name
          )
        `)
        .order('date', { ascending: false })
        .limit(5)

      if (error) {
        console.error('Error loading appointments:', error)
        return
      }

      if (!appointments || appointments.length === 0) {
        return
      }

      // Luego obtenemos los nombres de los estilistas
      const clientsWithStylists = await Promise.all(
        appointments.map(async (appointment) => {
          const { data: stylistData } = await supabase
            .from('stylists')
            .select('name')
            .eq('id', appointment.stylist_id)
            .single()

          return {
            id: appointment.clients.id,
            first_name: appointment.clients.first_name,
            last_name: appointment.clients.last_name,
            last_visit: appointment.date,
            stylist: stylistData?.name || 'No asignado'
          }
        })
      )

      setClients(clientsWithStylists)
    }

    loadRecentClients()
  }, [])

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const handleClientClick = (clientId: string) => {
    router.push(`/clients/${clientId}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {clients.map((client) => (
            <div
              key={client.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => handleClientClick(client.id)}
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>
                    {getInitials(client.first_name, client.last_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {client.first_name} {client.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Atendido por: {client.stylist}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {clients.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              No hay clientes recientes
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 