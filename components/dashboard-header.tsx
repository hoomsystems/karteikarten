"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { UserNav } from "@/components/user-nav"
import { cn } from "@/lib/utils/cn"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardHeader() {
  const { user } = useAuth()
  const pathname = usePathname()
  const isAdmin = user?.role === 'admin'

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          <Link
            href="/dashboard"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/dashboard"
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            Dashboard
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          {isAdmin && (
            <Button
              variant="ghost"
              size="icon"
              asChild
              className={cn(
                "hover:bg-muted",
                pathname.startsWith("/dashboard/settings") && "bg-muted"
              )}
            >
              <Link href="/dashboard/settings">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Configuración</span>
              </Link>
            </Button>
          )}
          <UserNav />
        </div>
      </div>
    </div>
  )
}

