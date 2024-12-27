import { useCallback, useState } from 'react'
import { supabase } from '../supabase'
import type { AuthUser, UserOnboarding } from '../types/auth.types'

export const useAuth = () => {
  const [loading, setLoading] = useState(false)

  const signUp = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      return data
    } finally {
      setLoading(false)
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return data
    } finally {
      setLoading(false)
    }
  }, [])

  const completeOnboarding = useCallback(async (userId: string, onboardingData: UserOnboarding) => {
    setLoading(true)
    try {
      // 1. Crear la compañía
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({ name: onboardingData.company_name })
        .select()
        .single()

      if (companyError) throw companyError

      // 2. Actualizar el usuario con los datos adicionales
      const { error: userError } = await supabase
        .from('users')
        .update({
          first_name: onboardingData.first_name,
          last_name: onboardingData.last_name,
          role: onboardingData.role,
          phone: onboardingData.phone,
          company_id: company.id,
          is_super_admin: true // Para el primer usuario de la empresa
        })
        .eq('id', userId)

      if (userError) throw userError

      return company
    } finally {
      setLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }, [])

  return {
    loading,
    signUp,
    signIn,
    signOut,
    completeOnboarding
  }
}