"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const stylistFormSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor ingresa un email válido.",
  }),
  phone: z.string().optional(),
  venue: z.string({
    required_error: "Por favor selecciona una sucursal.",
  }),
})

type StylistFormValues = z.infer<typeof stylistFormSchema>

export function StylistSettings() {
  const [stylists, setStylists] = useState([
    { 
      id: 1, 
      name: "Ana García", 
      email: "ana@example.com", 
      phone: "555-0123",
      venue: "Sucursal Centro"
    },
    { 
      id: 2, 
      name: "Carlos López", 
      email: "carlos@example.com", 
      phone: "555-0456",
      venue: "Sucursal Norte"
    },
  ])

  const venues = [
    { id: 1, name: "Sucursal Centro" },
    { id: 2, name: "Sucursal Norte" },
  ]

  const form = useForm<StylistFormValues>({
    resolver: zodResolver(stylistFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      venue: "",
    },
  })

  async function onSubmit(data: StylistFormValues) {
    try {
      // Aquí iría la llamada a la API para crear el estilista
      const newStylist = {
        id: stylists.length + 1,
        ...data,
      }
      setStylists([...stylists, newStylist])
      form.reset()
      toast({
        title: "Estilista agregado",
        description: "El estilista ha sido agregado exitosamente.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo agregar el estilista.",
      })
    }
  }

  async function deleteStylist(id: number) {
    try {
      // Aquí iría la llamada a la API para eliminar el estilista
      setStylists(stylists.filter(stylist => stylist.id !== id))
      toast({
        title: "Estilista eliminado",
        description: "El estilista ha sido eliminado exitosamente.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el estilista.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo Estilista</CardTitle>
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                {...form.register("phone")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue">Sucursal</Label>
              <Select 
                onValueChange={(value) => form.setValue("venue", value)}
                defaultValue={form.getValues("venue")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una sucursal" />
                </SelectTrigger>
                <SelectContent>
                  {venues.map((venue) => (
                    <SelectItem key={venue.id} value={venue.name}>
                      {venue.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Agregar Estilista</Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estilistas</CardTitle>
        </CardHeader>
        <CardContent>
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
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteStylist(stylist.id)}
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

