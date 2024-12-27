import { useCallback } from 'react'
import { supabase } from '../supabase'
import type { Venue } from '../types/database.types'

export const useVenues = () => {
  const getVenues = useCallback(async (companyId: string) => {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .eq('company_id', companyId)
      .order('name')
    
    if (error) throw error
    return data as Venue[]
  }, [])

  const addVenue = useCallback(async (venue: Omit<Venue, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('venues')
      .insert(venue)
      .select()
      .single()
    
    if (error) throw error
    return data as Venue
  }, [])

  return { getVenues, addVenue }
}