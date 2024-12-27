"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { DateTimePicker } from "@/components/date-time-picker"
import { Plus, X } from "lucide-react"

interface AddAppointmentFormProps {
  clientId: string
  venueId: string
}

interface Service {
  service_name: string
  notes?: string
}

interface Formula {
  formula: string
  notes?: string
}

interface Treatment {
  treatment_name: string
  notes?: string
}

interface Product {
  product_name: string
  quantity?: string
  notes?: string
}

interface Photo {
  photo_url: string
  photo_type: 'before' | 'after'
}

export function AddAppointmentForm({ clientId, venueId }: AddAppointmentFormProps) {
  const [date, setDate] = useState<Date>(new Date())
  const [stylistId, setStylistId] = useState("")
  const [services, setServices] = useState<Service[]>([])
  const [formulas, setFormulas] = useState<Formula[]>([])
  const [treatments, setTreatments] = useState<Treatment[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [photos, setPhotos] = useState<Photo[]>([])
  const [beverage, setBeverage] = useState("")
  const [conversationTopics, setConversationTopics] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [stylists, setStylists] = useState<any[]>([])

  // Estados temporales para nuevos items
  const [newService, setNewService] = useState({ service_name: "", notes: "" })
  const [newFormula, setNewFormula] = useState({ formula: "", notes: "" })
  const [newTreatment, setNewTreatment] = useState({ treatment_name: "", notes: "" })
  const [newProduct, setNewProduct] = useState({ product_name: "", quantity: "", notes: "" })
  const [newPhoto, setNewPhoto] = useState({ photo_url: "", photo_type: "before" as "before" | "after" })

  const router = useRouter()
  const supabase = createClientComponentClient()

  const loadStylists = async () => {
    try {
      const { data, error } = await supabase
        .from('stylists')
        .select('id, name')
        .eq('venue_id', venueId)

      if (error) {
        console.error('Error loading stylists:', error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los estilistas",
          variant: "destructive"
        })
        return
      }

      console.log('Stylists loaded:', data)
      setStylists(data || [])
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Error al cargar los estilistas",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    loadStylists()
  }, [venueId]) // Agregamos venueId como dependencia

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !stylistId) {
      toast({
        title: "Error",
        description: "Por favor completa los campos requeridos",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      // 1. Crear la cita
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          client_id: clientId,
          stylist_id: stylistId,
          venue_id: venueId,
          date,
          status: 'scheduled',
          notes,
          beverage,
          conversation_topics: conversationTopics,
          video_url: videoUrl
        })
        .select()
        .single()

      if (appointmentError) throw appointmentError

      // 2. Insertar servicios
      if (services.length > 0) {
        const { error: servicesError } = await supabase
          .from('appointment_services')
          .insert(services.map(service => ({
            appointment_id: appointment.id,
            service_name: service.service_name,
            notes: service.notes
          })))
        if (servicesError) throw servicesError
      }

      // 3. Insertar fórmulas
      if (formulas.length > 0) {
        const { error: formulasError } = await supabase
          .from('appointment_formulas')
          .insert(formulas.map(formula => ({
            appointment_id: appointment.id,
            ...formula
          })))
        if (formulasError) throw formulasError
      }

      // 4. Insertar tratamientos
      if (treatments.length > 0) {
        const { error: treatmentsError } = await supabase
          .from('appointment_treatments')
          .insert(treatments.map(treatment => ({
            appointment_id: appointment.id,
            ...treatment
          })))
        if (treatmentsError) throw treatmentsError
      }

      // 5. Insertar productos
      if (products.length > 0) {
        const { error: productsError } = await supabase
          .from('appointment_products')
          .insert(products.map(product => ({
            appointment_id: appointment.id,
            ...product
          })))
        if (productsError) throw productsError
      }

      // 6. Insertar fotos
      if (photos.length > 0) {
        const { error: photosError } = await supabase
          .from('appointment_photos')
          .insert(photos.map(photo => ({
            appointment_id: appointment.id,
            ...photo
          })))
        if (photosError) throw photosError
      }

      toast({
        title: "Cita creada",
        description: "La cita se ha creado correctamente"
      })

      router.refresh()
    } catch (error) {
      console.error('Error creating appointment:', error)
      toast({
        title: "Error",
        description: "No se pudo crear la cita",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nueva Cita</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Fecha y Estilista */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Fecha y Hora</Label>
              <DateTimePicker date={date} setDate={setDate} />
            </div>
            <div className="space-y-2">
              <Label>Estilista</Label>
              <Select value={stylistId} onValueChange={setStylistId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estilista" />
                </SelectTrigger>
                <SelectContent>
                  {stylists.length > 0 ? (
                    stylists.map((stylist) => (
                      <SelectItem 
                        key={stylist.id} 
                        value={stylist.id}
                      >
                        {stylist.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-stylists" disabled>
                      No hay estilistas disponibles
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Servicios */}
          <div className="space-y-2">
            <Label>Servicios</Label>
            <div className="space-y-2">
              {services.map((service, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <div className="flex-1">
                    <div className="font-medium">{service.service_name}</div>
                    {service.notes && <div className="text-sm text-muted-foreground">{service.notes}</div>}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setServices(services.filter((_, i) => i !== index))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="Nombre del servicio"
                  value={newService.service_name}
                  onChange={(e) => setNewService({ ...newService, service_name: e.target.value })}
                />
                <Input
                  placeholder="Notas del servicio"
                  value={newService.notes}
                  onChange={(e) => setNewService({ ...newService, notes: e.target.value })}
                />
                <Button 
                  type="button" 
                  onClick={() => {
                    if (newService.service_name) {
                      setServices([...services, { ...newService }])
                      setNewService({ service_name: "", notes: "" })
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Fórmulas */}
          <div className="space-y-2">
            <Label>Fórmulas</Label>
            <div className="space-y-2">
              {formulas.map((formula, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <div className="flex-1">
                    <div className="font-medium">{formula.formula}</div>
                    {formula.notes && <div className="text-sm text-muted-foreground">{formula.notes}</div>}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormulas(formulas.filter((_, i) => i !== index))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="Fórmula"
                  value={newFormula.formula}
                  onChange={(e) => setNewFormula({ ...newFormula, formula: e.target.value })}
                />
                <Input
                  placeholder="Notas"
                  value={newFormula.notes}
                  onChange={(e) => setNewFormula({ ...newFormula, notes: e.target.value })}
                />
                <Button 
                  type="button" 
                  onClick={() => {
                    if (newFormula.formula) {
                      setFormulas([...formulas, { ...newFormula }])
                      setNewFormula({ formula: "", notes: "" })
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tratamientos */}
          <div className="space-y-2">
            <Label>Tratamientos</Label>
            <div className="space-y-2">
              {treatments.map((treatment, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <div className="flex-1">
                    <div className="font-medium">{treatment.treatment_name}</div>
                    {treatment.notes && <div className="text-sm text-muted-foreground">{treatment.notes}</div>}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setTreatments(treatments.filter((_, i) => i !== index))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="Nombre del tratamiento"
                  value={newTreatment.treatment_name}
                  onChange={(e) => setNewTreatment({ ...newTreatment, treatment_name: e.target.value })}
                />
                <Input
                  placeholder="Notas"
                  value={newTreatment.notes}
                  onChange={(e) => setNewTreatment({ ...newTreatment, notes: e.target.value })}
                />
                <Button 
                  type="button" 
                  onClick={() => {
                    if (newTreatment.treatment_name) {
                      setTreatments([...treatments, { ...newTreatment }])
                      setNewTreatment({ treatment_name: "", notes: "" })
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="space-y-2">
            <Label>Productos Usados</Label>
            <div className="space-y-2">
              {products.map((product, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <div className="flex-1">
                    <div className="font-medium">{product.product_name}</div>
                    {product.quantity && <div className="text-sm">Cantidad: {product.quantity}</div>}
                    {product.notes && <div className="text-sm text-muted-foreground">{product.notes}</div>}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setProducts(products.filter((_, i) => i !== index))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="grid gap-2 md:grid-cols-3">
                <Input
                  placeholder="Nombre del producto"
                  value={newProduct.product_name}
                  onChange={(e) => setNewProduct({ ...newProduct, product_name: e.target.value })}
                />
                <Input
                  placeholder="Cantidad"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Notas"
                    value={newProduct.notes}
                    onChange={(e) => setNewProduct({ ...newProduct, notes: e.target.value })}
                  />
                  <Button 
                    type="button" 
                    onClick={() => {
                      if (newProduct.product_name) {
                        setProducts([...products, { ...newProduct }])
                        setNewProduct({ product_name: "", quantity: "", notes: "" })
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Fotos */}
          <div className="space-y-2">
            <Label>Fotos</Label>
            <div className="space-y-2">
              {photos.map((photo, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <div className="flex-1">
                    <div className="font-medium">{photo.photo_type === 'before' ? 'Antes' : 'Después'}</div>
                    <div className="text-sm text-muted-foreground">{photo.photo_url}</div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="URL de la foto"
                  value={newPhoto.photo_url}
                  onChange={(e) => setNewPhoto({ ...newPhoto, photo_url: e.target.value })}
                />
                <Select 
                  value={newPhoto.photo_type} 
                  onValueChange={(value: 'before' | 'after') => setNewPhoto({ ...newPhoto, photo_type: value })}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Tipo de foto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="before">Antes</SelectItem>
                    <SelectItem value="after">Después</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  type="button" 
                  onClick={() => {
                    if (newPhoto.photo_url) {
                      setPhotos([...photos, { ...newPhoto }])
                      setNewPhoto({ photo_url: "", photo_type: "before" })
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Campos adicionales */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Bebida</Label>
              <Input
                value={beverage}
                onChange={(e) => setBeverage(e.target.value)}
                placeholder="Bebida preferida"
              />
            </div>
            <div className="space-y-2">
              <Label>Video URL (opcional)</Label>
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="URL del video"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tópicos de Conversación</Label>
            <Textarea
              value={conversationTopics}
              onChange={(e) => setConversationTopics(e.target.value)}
              placeholder="Temas de conversación importantes..."
            />
          </div>

          <div className="space-y-2">
            <Label>Notas Generales</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas adicionales..."
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creando cita..." : "Crear Cita"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}