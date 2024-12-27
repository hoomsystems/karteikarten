import { DashboardHeader } from "@/components/dashboard-header"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="space-y-6 p-6 pb-16">
      {children}
    </div>
  )
}

