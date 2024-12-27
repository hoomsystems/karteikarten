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

type Venue = {
  id: number
  name: string
  address: string
  phone: string
}

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([
    {
      id: 1,
      name: "Sucursal Centro",
      address: "Calle Principal #123",
      phone: "123-456-7890",
    },
    {
      id: 2,
      name: "Sucursal Norte",
      address: "Av. Norte #456",
      phone: "123-456-7891",
    },
  ])

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Sucursales</h2>
        <Button>Agregar Sucursal</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {venues.map((venue) => (
                <TableRow key={venue.id}>
                  <TableCell>{venue.name}</TableCell>
                  <TableCell>{venue.address}</TableCell>
                  <TableCell>{venue.phone}</TableCell>
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

