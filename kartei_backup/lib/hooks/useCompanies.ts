import { useCallback } from 'react'
import { supabase } from '../supabase'
import type { Company } from '../types/database.types'

export const useCompanies = () => {
  const getCompany = useCallback(async (id: string) => {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Company
  }, [])

  const updateCompany = useCallback(async (
    id: string, 
    updates: Partial<Omit<Company, 'id' | 'created_at' | 'updated_at'>>
  ) => {
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Company
  }, [])

  return { getCompany, updateCompany }
}