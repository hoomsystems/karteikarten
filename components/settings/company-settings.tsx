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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const companyFormSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor ingrese un email válido.",
  }),
  phone: z.string().min(1, {
    message: "Por favor ingrese un número de teléfono.",
  }),
  address: z.string().min(1, {
    message: "Por favor ingrese una dirección.",
  }),
})

type CompanyFormValues = z.infer<typeof companyFormSchema>

export function CompanySettings() {
  const [loading, setLoading] = useState(false)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  })

  async function onSubmit(data: CompanyFormValues) {
    try {
      setLoading(true)
      
      if (companyId) {
        // Actualizar empresa existente
        const { error: updateError } = await supabase
          .from('companies')
          .update({
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            updated_at: new Date().toISOString(),
          })
          .eq('id', companyId)
        
        if (updateError) throw updateError
      } else {
        // Crear nueva empresa
        const { data: newCompany, error: insertError } = await supabase
          .from('companies')
          .insert([{
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
          }])
          .select()
        
        if (insertError) throw insertError
        if (newCompany) setCompanyId(newCompany[0].id)
      }

      toast({
        title: "Información actualizada",
        description: "Los datos de la empresa se han guardado correctamente.",
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios. Por favor intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Cargar datos existentes
  useEffect(() => {
    async function loadCompanyData() {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .single()

        if (error && error.code !== 'PGRST116') throw error
        
        if (data) {
          setCompanyId(data.id)
          form.reset({
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
          })
        }
      } catch (error) {
        console.error('Error loading company data:', error)
      }
    }

    loadCompanyData()
  }, [])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la empresa</FormLabel>
              <FormControl>
                <Input placeholder="Mi Salón de Belleza" {...field} />
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
                <Input placeholder="contacto@misalon.com" {...field} />
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
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar cambios"}
        </Button>
      </form>
    </Form>
  )
}

