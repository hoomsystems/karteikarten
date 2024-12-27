"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Client {
  id: string
  first_name: string
  last_name: string
  email: string | null
  created_at: string
}

export function ClientList() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  const loadClients = async () => {
    try {
      setLoading(true)
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return

      // Usar la función RPC
      const { data: userInfo, error: userError } = await supabase
        .rpc('get_user_info', {
          user_auth_id: userData.user.id
        })
        .single()

      if (userError) throw userError
      if (!userInfo) return

      let query = supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      if (!userInfo.is_super_admin) {
        query = query.eq('venue_id', userInfo.venue_id)
      }

      const { data, error } = await query

      if (error) throw error
      if (data) setClients(data)
    } catch (error) {
      console.error('Error loading clients:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClients()
  }, [])

  // Suscribirse a cambios en la tabla clients
  useEffect(() => {
    const channel = supabase
      .channel('clients_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'clients' 
        }, 
        () => {
          loadClients()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const filteredClients = clients.filter(client =>
    `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listado de Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          placeholder="Buscar clientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Fecha de Registro</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10">
                  <div className="flex justify-center items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                    <span>Cargando clientes...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10">
                  No se encontraron clientes
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <Link href={`/clients/${client.id}`} className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>
                          {client.first_name[0]}{client.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      {client.first_name} {client.last_name}
                    </Link>
                  </TableCell>
                  <TableCell>{client.email || "—"}</TableCell>
                  <TableCell>
                    {format(new Date(client.created_at), 'dd/MM/yyyy', { locale: es })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

