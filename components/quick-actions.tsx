import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, Users } from 'lucide-react'
import Link from "next/link"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-24 flex-col" asChild>
            <Link href="/clients/add">
              <UserPlus className="h-6 w-6 mb-2" />
              Add Client
            </Link>
          </Button>
          <Button variant="outline" className="h-24 flex-col" asChild>
            <Link href="/clients">
              <Users className="h-6 w-6 mb-2" />
              View All Clients
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

