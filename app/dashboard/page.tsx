"use client"

import { RecentClients } from "@/components/dashboard/recent-clients"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Search, Settings } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between mb-8">
        <Button onClick={() => window.location.href = '/clients'}>
          <Search className="w-4 h-4 mr-2" />
          Buscar Clientes
        </Button>

        <Button variant="outline" onClick={() => window.location.href = '/dashboard/settings'}>
          <Settings className="w-4 h-4 mr-2" />
          Configuración
        </Button>
      </div>

      <RecentClients />
    </div>
  )
}

