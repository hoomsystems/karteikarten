"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { ChevronLeft, Plus } from "lucide-react"
import { AddAppointmentForm } from "@/components/appointments/add-appointment-form"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface Client {
  id: string
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  created_at: string
  venue_id: string
  company_id: string
}

interface ClientDetailsProps {
  initialClient: Client
}

export function ClientDetails({ initialClient }: ClientDetailsProps) {
  console.log('Initial client:', initialClient) // Debug log

  const [isEditing, setIsEditing] = useState(false)
  const [showNewAppointment, setShowNewAppointment] = useState(false)
  const [appointments, setAppointments] = useState([])
  const [formData, setFormData] = useState(initialClient)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)

  // Cargar citas existentes
  const loadAppointments = async () => {
    console.log('Loading appointments for client ID:', initialClient.id)

    // 1. Obtener las citas con sus relaciones
    const { data: appointmentsData, error: appointmentsError } = await supabase
      .from('appointments')
      .select('*')
      .eq('client_id', initialClient.id)
      .order('date', { ascending: false })

    if (appointmentsError) {
      console.error('Error loading appointments:', appointmentsError)
      return
    }

    if (!appointmentsData || appointmentsData.length === 0) {
      setAppointments([])
      return
    }

    // 2. Para cada cita, obtener todos los detalles relacionados
    const appointmentsWithDetails = await Promise.all(
      appointmentsData.map(async (appointment) => {
        // Obtener el estilista
        const { data: stylistData } = await supabase
          .from('stylists')
          .select('name')
          .eq('id', appointment.stylist_id)
          .single()

        // Obtener fórmulas
        const { data: formulas } = await supabase
          .from('appointment_formulas')
          .select('*')
          .eq('appointment_id', appointment.id)

        // Obtener fotos
        const { data: photos } = await supabase
          .from('appointment_photos')
          .select('*')
          .eq('appointment_id', appointment.id)

        // Obtener productos
        const { data: products } = await supabase
          .from('appointment_products')
          .select('*')
          .eq('appointment_id', appointment.id)

        // Obtener servicios
        const { data: services } = await supabase
          .from('appointment_services')
          .select('*')
          .eq('appointment_id', appointment.id)

        // Obtener tratamientos
        const { data: treatments } = await supabase
          .from('appointment_treatments')
          .select('*')
          .eq('appointment_id', appointment.id)

        return {
          ...appointment,
          stylist: stylistData,
          formulas: formulas || [],
          photos: photos || [],
          products: products || [],
          services: services || [],
          treatments: treatments || []
        }
      })
    )

    console.log('Appointments with all details:', appointmentsWithDetails)
    setAppointments(appointmentsWithDetails)
  }

  // Asegurarnos de que loadAppointments se ejecute cuando cambie el cliente
  useEffect(() => {
    if (initialClient?.id) {
      loadAppointments()
    }
  }, [initialClient?.id])

  // Función para manejar la creación exitosa de una cita
  const handleAppointmentCreated = () => {
    setShowNewAppointment(false) // Cerrar el formulario
    loadAppointments() // Recargar la lista de citas
  }

  if (!formData) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setLoading(true)

    try {
      const { data, error } = await supabase
        .rpc('update_client', {
          p_client_id: initialClient.id,
          p_first_name: formData.first_name,
          p_last_name: formData.last_name,
          p_email: formData.email || null,
          p_phone: formData.phone || null
        })

      if (error) {
        console.error('Error details:', error)
        throw error
      }

      if (!data) {
        throw new Error('No tienes permiso para actualizar este cliente')
      }

      setIsEditing(false)
      router.refresh()
    } catch (error) {
      console.error('Error updating client:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push('/clients')
  }

  const handleViewDetails = (appointment: any) => {
    setSelectedAppointment(appointment)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push('/clients')}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver a Clientes
        </Button>
        <Button
          onClick={() => setShowNewAppointment(!showNewAppointment)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {showNewAppointment ? "Cancelar Nueva Cita" : "Nueva Cita"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Nombre</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Apellido</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="flex justify-end space-x-2">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false)
                      setFormData(initialClient)
                    }}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar'}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                  >
                    Regresar
                  </Button>
                  <Button type="button" onClick={() => setIsEditing(true)}>
                    Editar
                  </Button>
                </>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {showNewAppointment && (
        <AddAppointmentForm 
          clientId={initialClient.id} 
          venueId={initialClient.venue_id}
          onSuccess={handleAppointmentCreated}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Historial de Citas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments && appointments.length > 0 ? (
              appointments.map((appointment: any) => (
                <div 
                  key={appointment.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">
                      {format(new Date(appointment.date), "PPP 'a las' p", { locale: es })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Estilista: {appointment.stylist?.name || 'No asignado'}
                    </p>
                    {appointment.service && (
                      <p className="text-sm text-muted-foreground">
                        Servicio: {appointment.service.name}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => handleViewDetails(appointment)}
                  >
                    Ver detalles
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No hay citas registradas
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog 
        open={!!selectedAppointment} 
        onOpenChange={() => setSelectedAppointment(null)}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles de la Cita</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {selectedAppointment && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Fecha</Label>
                    <p className="text-sm mt-1 font-medium">
                      {format(new Date(selectedAppointment.date), "PPP", { locale: es })}
                    </p>
                  </div>
                  <div>
                    <Label>Hora</Label>
                    <p className="text-sm mt-1 font-medium">
                      {format(new Date(selectedAppointment.date), "p", { locale: es })}
                    </p>
                  </div>
                </div>

                <div>
                  <Label>Estilista</Label>
                  <p className="text-sm mt-1 font-medium">
                    {selectedAppointment.stylist?.name || 'No asignado'}
                  </p>
                </div>

                <div>
                  <Label>Servicios</Label>
                  <div className="mt-1 space-y-1">
                    {selectedAppointment.services?.length > 0 ? (
                      selectedAppointment.services.map((service: any) => (
                        <p key={service.id} className="text-sm">
                          {service.name}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No hay servicios registrados
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Productos</Label>
                  <div className="mt-1 space-y-1">
                    {selectedAppointment.products?.length > 0 ? (
                      selectedAppointment.products.map((product: any) => (
                        <p key={product.id} className="text-sm">
                          {product.name}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No hay productos registrados
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Fórmulas</Label>
                  <div className="mt-1 space-y-1">
                    {selectedAppointment.formulas?.length > 0 ? (
                      selectedAppointment.formulas.map((formula: any) => (
                        <p key={formula.id} className="text-sm">
                          {formula.description}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No hay fórmulas registradas
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Tratamientos</Label>
                  <div className="mt-1 space-y-1">
                    {selectedAppointment.treatments?.length > 0 ? (
                      selectedAppointment.treatments.map((treatment: any) => (
                        <p key={treatment.id} className="text-sm">
                          {treatment.name}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No hay tratamientos registrados
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Fotos</Label>
                  <div className="mt-1 space-y-1">
                    {selectedAppointment.photos?.length > 0 ? (
                      selectedAppointment.photos.map((photo: any) => (
                        <p key={photo.id} className="text-sm">
                          {photo.url}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No hay fotos registradas
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Notas</Label>
                  <p className="text-sm mt-1 whitespace-pre-wrap">
                    {selectedAppointment.notes || 'No hay notas registradas'}
                  </p>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

