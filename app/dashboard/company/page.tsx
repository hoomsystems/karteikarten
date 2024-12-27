"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export default function CompanyPage() {
  const [companyData, setCompanyData] = useState({
    name: "Mi Salón de Belleza",
    email: "contacto@misalon.com",
    phone: "123-456-7890",
    address: "Calle Principal #123",
  })

  const handleSave = () => {
    // Aquí iría la lógica para guardar en la base de datos
    toast({
      title: "Cambios guardados",
      description: "Los datos de la empresa han sido actualizados.",
    })
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Información de la Empresa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la empresa</Label>
            <Input
              id="name"
              value={companyData.name}
              onChange={(e) =>
                setCompanyData({ ...companyData, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              value={companyData.email}
              onChange={(e) =>
                setCompanyData({ ...companyData, email: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              value={companyData.phone}
              onChange={(e) =>
                setCompanyData({ ...companyData, phone: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              value={companyData.address}
              onChange={(e) =>
                setCompanyData({ ...companyData, address: e.target.value })
              }
            />
          </div>
          <Button onClick={handleSave} className="mt-4">
            Guardar cambios
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}