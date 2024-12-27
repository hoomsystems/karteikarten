import { useCallback } from 'react'
import { supabase } from '../supabase'
import type { Client, Appointment } from '../types/database.types'

export const useClients = () => {
  const getClients = useCallback(async (venueId: string) => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('venue_id', venueId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Client[]
  }, [])

  const addClient = useCallback(async (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single()
    
    if (error) throw error
    return data as Client
  }, [])

  return { getClients, addClient }
}