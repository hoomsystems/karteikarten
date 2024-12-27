import { useCallback } from 'react'
import { supabase } from '../supabase'
import type { Appointment, AppointmentService, File } from '../types/database.types'

export const useAppointments = () => {
  const getAppointments = useCallback(async (clientId: string) => {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        appointment_services (*),
        files (*)
      `)
      .eq('client_id', clientId)
      .order('date', { ascending: false })
    
    if (error) throw error
    return data as (Appointment & {
      appointment_services: AppointmentService[]
      files: File[]
    })[]
  }, [])

  const addAppointment = useCallback(async (
    appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>,
    services: Omit<AppointmentService, 'id' | 'created_at' | 'appointment_id'>[]
  ) => {
    const { data: appointmentData, error: appointmentError } = await supabase
      .from('appointments')
      .insert(appointment)
      .select()
      .single()
    
    if (appointmentError) throw appointmentError

    if (services.length > 0) {
      const { error: servicesError } = await supabase
        .from('appointment_services')
        .insert(
          services.map(service => ({
            ...service,
            appointment_id: appointmentData.id
          }))
        )
      
      if (servicesError) throw servicesError
    }

    return appointmentData as Appointment
  }, [])

  return { getAppointments, addAppointment }
}