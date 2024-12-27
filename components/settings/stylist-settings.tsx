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
  FormDescription,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Pencil, Trash2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"

const stylistFormSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Ingrese un email válido.",
  }),
  phone: z.string().min(1, {
    message: "El teléfono es requerido.",
  }),
  venue_id: z.string({
    required_error: "Seleccione una sucursal.",
  }),
  permissions: z.object({
    can_view_all_clients: z.boolean().default(false),
  }),
})

type StylistFormValues = z.infer<typeof stylistFormSchema>

type Stylist = {
  id: string
  name: string
  email: string
  phone: string
  venue_id: string
  venue: {
    name: string
  }
}

type Venue = {
  id: string
  name: string
}

export function StylistSettings() {
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStylist, setEditingStylist] = useState<Stylist | null>(null)
  const supabase = createClientComponentClient()

  const form = useForm<StylistFormValues>({
    resolver: zodResolver(stylistFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      venue_id: "",
      permissions: {
        can_view_all_clients: false,
      },
    },
  })

  const loadStylists = async () => {
    try {
      const { data, error } = await supabase
        .from('stylists')
        .select(`
          *,
          venue:venues(name)
        `)
        .order('name')

      if (error) throw error
      if (data) setStylists(data)
    } catch (error) {
      console.error('Error loading stylists:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los estilistas.",
        variant: "destructive",
      })
    }
  }

  const loadVenues = async () => {
    try {
      const { data, error } = await supabase
        .from('venues')
        .select('id, name')
        .order('name')

      if (error) throw error
      if (data) setVenues(data)
    } catch (error) {
      console.error('Error loading venues:', error)
    }
  }

  useEffect(() => {
    loadVenues()
    loadStylists()
  }, [])

  const onSubmit = async (data: StylistFormValues) => {
    try {
      setLoading(true)
      
      if (editingStylist) {
        const { error } = await supabase
          .from('stylists')
          .update({
            name: data.name,
            email: data.email,
            phone: data.phone,
            venue_id: data.venue_id,
            permissions: data.permissions,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingStylist.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('stylists')
          .insert([{
            name: data.name,
            email: data.email,
            phone: data.phone,
            venue_id: data.venue_id,
            permissions: data.permissions,
          }])

        if (error) throw error
      }

      await loadStylists()
      setIsDialogOpen(false)
      form.reset()
      setEditingStylist(null)
      
      toast({
        title: editingStylist ? "Estilista actualizado" : "Estilista creado",
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

  const handleEdit = (stylist: Stylist) => {
    setEditingStylist(stylist)
    form.reset({
      name: stylist.name,
      email: stylist.email,
      phone: stylist.phone,
      venue_id: stylist.venue_id,
      permissions: stylist.permissions,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este estilista?')) return

    try {
      const { error } = await supabase
        .from('stylists')
        .delete()
        .eq('id', id)

      if (error) throw error

      await loadStylists()
      toast({
        title: "Estilista eliminado",
        description: "El estilista ha sido eliminado correctamente.",
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el estilista.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Estilistas</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingStylist(null)
              form.reset({
                name: "",
                email: "",
                phone: "",
                venue_id: "",
                permissions: {
                  can_view_all_clients: false,
                },
              })
            }}>
              Agregar Estilista
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingStylist ? "Editar Estilista" : "Nuevo Estilista"}
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
                        <Input placeholder="Juan Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="juan@ejemplo.com" {...field} />
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
                <FormField
                  control={form.control}
                  name="venue_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sucursal</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una sucursal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {venues.map((venue) => (
                            <SelectItem key={venue.id} value={venue.id}>
                              {venue.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="permissions.can_view_all_clients"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Ver todos los clientes
                        </FormLabel>
                        <FormDescription>
                          Permite al estilista ver todos los clientes de su sucursal
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
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
                <TableCell>{stylist.venue?.name}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(stylist)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(stylist.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {stylists.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No hay estilistas registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

