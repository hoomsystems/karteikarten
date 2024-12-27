"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Pencil, Trash2 } from "lucide-react"

const venueFormSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  address: z.string().min(1, {
    message: "La dirección es requerida.",
  }),
  phone: z.string().min(1, {
    message: "El teléfono es requerido.",
  }),
})

type VenueFormValues = z.infer<typeof venueFormSchema>

type Venue = {
  id: string
  name: string
  address: string
  phone: string
}

export function VenueSettings() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  const form = useForm<VenueFormValues>({
    resolver: zodResolver(venueFormSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
    },
  })

  const loadVenues = async () => {
    try {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .order('name')

      if (error) throw error
      if (data) setVenues(data)
    } catch (error) {
      console.error('Error loading venues:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las sucursales.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    loadVenues()
  }, [])

  useEffect(() => {
    async function loadCompanyId() {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('id')
          .single()

        if (error) throw error
        if (data) setCompanyId(data.id)
      } catch (error) {
        console.error('Error loading company:', error)
        toast({
          title: "Error",
          description: "No se pudo cargar la información de la empresa.",
          variant: "destructive",
        })
      }
    }

    loadCompanyId()
  }, [])

  const onSubmit = async (data: VenueFormValues) => {
    if (!companyId) {
      toast({
        title: "Error",
        description: "No se pudo determinar la empresa. Por favor, configure primero la información de la empresa.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      
      if (editingVenue) {
        // Actualizar sucursal existente
        const { error } = await supabase
          .from('venues')
          .update({
            name: data.name,
            address: data.address,
            phone: data.phone,
            updated_at: new Date().toISOString(),
            company_id: companyId
          })
          .eq('id', editingVenue.id)

        if (error) throw error
      } else {
        // Crear nueva sucursal
        const { error } = await supabase
          .from('venues')
          .insert([{
            name: data.name,
            address: data.address,
            phone: data.phone,
            company_id: companyId
          }])

        if (error) throw error
      }

      await loadVenues()
      setIsDialogOpen(false)
      form.reset()
      setEditingVenue(null)
      
      toast({
        title: editingVenue ? "Sucursal actualizada" : "Sucursal creada",
        description: "Los cambios se han guardado correctamente.",
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (venue: Venue) => {
    setEditingVenue(venue)
    form.reset({
      name: venue.name,
      address: venue.address,
      phone: venue.phone,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta sucursal?')) return

    try {
      const { error } = await supabase
        .from('venues')
        .delete()
        .eq('id', id)

      if (error) throw error

      await loadVenues()
      toast({
        title: "Sucursal eliminada",
        description: "La sucursal ha sido eliminada correctamente.",
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la sucursal.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sucursales</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingVenue(null)
              form.reset({
                name: "",
                address: "",
                phone: "",
              })
            }}>
              Agregar Sucursal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingVenue ? "Editar Sucursal" : "Nueva Sucursal"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Sucursal Centro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input placeholder="Calle Principal #123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="123-456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loading}>
                  {loading ? "Guardando..." : "Guardar"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
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
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(venue)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(venue.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {venues.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No hay sucursales registradas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

