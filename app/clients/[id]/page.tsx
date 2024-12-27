import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ClientDetails } from "@/components/client-details"
import { notFound } from "next/navigation"

interface Client {
  id: string
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  created_at: string
}

export default async function ClientDetailsPage({
  params
}: {
  params: { id: string }
}) {
  const supabase = createServerComponentClient({ cookies })

  const { data: client, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !client) {
    console.error('Error loading client:', error)
    notFound()
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={`${client.first_name} ${client.last_name}`}
        text="Detalles del cliente"
      />
      <ClientDetails initialClient={client} />
    </DashboardShell>
  )
}

