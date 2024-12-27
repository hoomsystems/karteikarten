"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const venueFormSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  address: z.string().min(5, {
    message: "La dirección debe tener al menos 5 caracteres.",
  }),
  phone: z.string().optional(),
})

type VenueFormValues = z.infer<typeof venueFormSchema>

export function VenueSettings() {
  const [venues, setVenues] = useState([
    { id: 1, name: "Sucursal Centro", address: "Calle Principal 123", phone: "555-0123" },
    { id: 2, name: "Sucursal Norte", address: "Av. Norte 456", phone: "555-0456" },
  ])

  const form = useForm<VenueFormValues>({
    resolver: zodResolver(venueFormSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
    },
  })

  async function onSubmit(data: VenueFormValues) {
    try {
      // Aquí iría la llamada a la API para crear la sucursal
      const newVenue = {
        id: venues.length + 1,
        ...data,
      }
      setVenues([...venues, newVenue])
      form.reset()
      toast({
        title: "Sucursal creada",
        description: "La sucursal ha sido creada exitosamente.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear la sucursal.",
      })
    }
  }

  async function deleteVenue(id: number) {
    try {
      // Aquí iría la llamada a la API para eliminar la sucursal
      setVenues(venues.filter(venue => venue.id !== id))
      toast({
        title: "Sucursal eliminada",
        description: "La sucursal ha sido eliminada exitosamente.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar la sucursal.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nueva Sucursal</CardTitle>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                {...form.register("name")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                {...form.register("address")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                {...form.register("phone")}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Agregar Sucursal</Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sucursales</CardTitle>
        </CardHeader>
        <CardContent>
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
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteVenue(venue.id)}
                    >
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

