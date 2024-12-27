"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Stylist = {
  id: number
  name: string
  email: string
  phone: string
  venue: string
}

export default function StylistsPage() {
  const [stylists, setStylists] = useState<Stylist[]>([
    {
      id: 1,
      name: "Ana García",
      email: "ana@salon.com",
      phone: "123-456-7890",
      venue: "Sucursal Centro"
    },
    {
      id: 2,
      name: "Carlos López",
      email: "carlos@salon.com",
      phone: "123-456-7891",
      venue: "Sucursal Norte"
    },
  ])

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Estilistas</h2>
        <Button>Agregar Estilista</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Sucursal</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stylists.map((stylist) => (
                <TableRow key={stylist.id}>
                  <TableCell>{stylist.name}</TableCell>
                  <TableCell>{stylist.email}</TableCell>
                  <TableCell>{stylist.phone}</TableCell>
                  <TableCell>{stylist.venue}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Editar
                    </Button>
                    <Button variant="destructive" size="sm" className="ml-2">
                      Eliminar
                    </Button>
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

