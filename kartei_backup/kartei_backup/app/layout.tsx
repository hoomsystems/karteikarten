import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"
import { SupabaseProvider } from '@/components/supabase-provider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <SupabaseProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}

