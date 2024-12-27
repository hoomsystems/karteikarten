"use client"

import { useEffect, useState, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'

interface SupabaseProviderProps {
  children: ReactNode
}

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    async function checkConnection() {
      try {
        const { data, error } = await supabase.from('companies').select('count')
        if (error) throw error
        setIsConnected(true)
        console.log('Conexión a Supabase exitosa')
      } catch (error) {
        console.error('Error conectando a Supabase:', error)
        setIsConnected(false)
      }
    }

    checkConnection()
  }, [])

  return <>{children}</>
}