"use client"

import * as React from "react"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

// Datos de códigos de país
const countryCodes = [
  { code: "+49", country: "Alemania" },
  { code: "+34", country: "España" },
  { code: "+43", country: "Austria" },
  { code: "+41", country: "Suiza" },
  { code: "+33", country: "Francia" },
  { code: "+39", country: "Italia" },
  { code: "+31", country: "Países Bajos" },
  { code: "+32", country: "Bélgica" },
  { code: "+44", country: "Reino Unido" },
  { code: "+1", country: "Estados Unidos/Canadá" },
  { code: "+52", country: "México" },
]

const clientFormSchema = z.object({
  first_name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  last_name: z.string().min(2, {
    message: "El apellido debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Ingrese un email válido.",
  }).optional().or(z.literal('')),
  country_code: z.string().default("+49"),
  phone_number: z.string().min(8, {
    message: "Ingrese un número de teléfono válido.",
  }).optional().or(z.literal('')),
  birth_date: z.date().optional(),
  preferred_beverage: z.string().optional(),
  notes: z.string().optional(),
})

type ClientFormValues = z.infer<typeof clientFormSchema>

// Función auxiliar para generar años
const generateYears = () => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = currentYear; i >= 1920; i--) {
    years.push(i)
  }
  return years
}

// Función auxiliar para generar meses
const months = Array.from({ length: 12 }, (_, i) => ({
  value: i,
  label: es.localize?.month(i, { width: 'wide' }) || ''
}))

export function AddClientForm() {
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      country_code: "+49",
      phone_number: "",
      preferred_beverage: "",
      notes: "",
    },
  })

  async function onSubmit(data: ClientFormValues) {
    try {
      setLoading(true)
      
      // Combinar código de país y número de teléfono
      const fullPhone = data.phone_number ? `${data.country_code}${data.phone_number}` : null

      // Obtener el usuario actual
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!userData.user) throw new Error("No se encontró el usuario")

      // Obtener el venue específico
      const { data: venueData, error: venueError } = await supabase
        .from('venues')
        .select('id, company_id')
        .eq('id', '4477d31f-bc65-448e-8ce2-e7d2cfb09bbd')
        .single()

      if (venueError || !venueData) {
        throw new Error("No se encontró el venue especificado")
      }

      // Llamar a la función RPC para insertar el cliente
      const { data: clientId, error: insertError } = await supabase
        .rpc('insert_client', {
          p_first_name: data.first_name,
          p_last_name: data.last_name,
          p_email: data.email || null,
          p_phone: fullPhone,
          p_birth_date: data.birth_date || null,
          p_preferred_beverage: data.preferred_beverage || null,
          p_notes: data.notes || null,
          p_venue_id: venueData.id,
          p_company_id: venueData.company_id,
          p_created_by: userData.user.id
        })

      if (insertError) {
        console.error('Error al insertar cliente:', insertError)
        throw insertError
      }

      toast({
        title: "Cliente creado",
        description: "El cliente se ha creado exitosamente.",
      })

      // Limpiar el formulario después de un guardado exitoso
      form.reset()
      
    } catch (error) {
      console.error('Error al crear cliente:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Hubo un error al crear el cliente",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Juan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="Pérez" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="juan@ejemplo.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="country_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Código" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countryCodes.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <span className="font-mono">{country.code}</span>
                        {" "}
                        <span className="text-muted-foreground">
                          {country.country}
                        </span>
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
            name="phone_number"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="123 456 7890" 
                    {...field}
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="birth_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha de nacimiento</FormLabel>
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "d 'de' MMMM 'de' yyyy", { locale: es })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-4" align="start">
                  <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                    {/* Año y Mes */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Selector de Año */}
                      <div>
                        <Select
                          value={field.value ? field.value.getFullYear().toString() : new Date().getFullYear().toString()}
                          onValueChange={(year) => {
                            const newDate = new Date(
                              parseInt(year),
                              field.value?.getMonth() || new Date().getMonth(),
                              field.value?.getDate() || 1
                            )
                            field.onChange(newDate)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Año" />
                          </SelectTrigger>
                          <SelectContent>
                            <div className="max-h-[200px] overflow-y-auto">
                              {generateYears().map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </div>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Selector de Mes */}
                      <div>
                        <Select
                          value={field.value ? field.value.getMonth().toString() : new Date().getMonth().toString()}
                          onValueChange={(month) => {
                            const newDate = new Date(
                              field.value?.getFullYear() || new Date().getFullYear(),
                              parseInt(month),
                              field.value?.getDate() || 1
                            )
                            field.onChange(newDate)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Mes" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem key={month.value} value={month.value.toString()}>
                                {month.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Selector de Días */}
                    <div>
                      <div className="grid grid-cols-7 gap-1">
                        {/* Días de la semana */}
                        {Array.from({ length: 7 }, (_, i) => (
                          <div key={i} className="text-center text-sm font-medium text-muted-foreground p-2">
                            {es.localize?.day((i + 1) % 7, { width: 'narrow' })}
                          </div>
                        ))}
                        
                        {/* Días del mes */}
                        {Array.from({ length: 35 }, (_, i) => {
                          const date = new Date(
                            field.value?.getFullYear() || new Date().getFullYear(),
                            field.value?.getMonth() || new Date().getMonth(),
                            1
                          )
                          const firstDay = date.getDay()
                          const daysInMonth = new Date(
                            date.getFullYear(),
                            date.getMonth() + 1,
                            0
                          ).getDate()
                          const day = i - (firstDay - 1)

                          return (
                            <div
                              key={i}
                              className={cn(
                                "h-8 w-8 p-0 font-normal flex items-center justify-center rounded-md",
                                day <= 0 || day > daysInMonth ? "invisible" : "cursor-pointer",
                                field.value && field.value.getDate() === day
                                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                  : day > 0 && day <= daysInMonth
                                  ? "hover:bg-accent hover:text-accent-foreground"
                                  : ""
                              )}
                              onClick={() => {
                                if (day > 0 && day <= daysInMonth) {
                                  const newDate = new Date(
                                    field.value?.getFullYear() || new Date().getFullYear(),
                                    field.value?.getMonth() || new Date().getMonth(),
                                    day
                                  )
                                  field.onChange(newDate)
                                }
                              }}
                            >
                              {day > 0 && day <= daysInMonth ? day : ""}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferred_beverage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bebida preferida</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Café americano" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Notas adicionales, preferencias, alergias..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar Cliente"}
        </Button>
      </form>
    </Form>
  )
} 