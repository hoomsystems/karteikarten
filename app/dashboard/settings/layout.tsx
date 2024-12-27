import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CompanySettings } from "@/components/settings/company-settings"
import { VenueSettings } from "@/components/settings/venue-settings"
import { StylistSettings } from "@/components/settings/stylist-settings"

export default function SettingsLayout() {
  return (
    <div className="space-y-6 p-10 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground">
          Administra la configuración de tu negocio
        </p>
      </div>
      <Tabs defaultValue="company" className="space-y-4">
        <TabsList>
          <TabsTrigger value="company">Empresa</TabsTrigger>
          <TabsTrigger value="venues">Sucursales</TabsTrigger>
          <TabsTrigger value="stylists">Estilistas</TabsTrigger>
        </TabsList>
        <TabsContent value="company" className="space-y-4">
          <CompanySettings />
        </TabsContent>
        <TabsContent value="venues" className="space-y-4">
          <VenueSettings />
        </TabsContent>
        <TabsContent value="stylists" className="space-y-4">
          <StylistSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
} 