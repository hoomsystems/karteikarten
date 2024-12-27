import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash } from 'lucide-react'

const stylists = [
  {
    id: 1,
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "(123) 456-7890",
    role: "Senior Stylist",
    specialties: "Color, Cuts",
  },
  {
    id: 2,
    name: "John Smith",
    email: "john@example.com",
    phone: "(987) 654-3210",
    role: "Junior Stylist",
    specialties: "Blowouts, Styling",
  },
  // Add more sample stylists as needed
]

export function StylistsList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stylists</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow><TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Specialties</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stylists.map((stylist) => (
              <TableRow key={stylist.id}>
                <TableCell>{stylist.name}</TableCell>
                <TableCell>{stylist.email}</TableCell>
                <TableCell>{stylist.phone}</TableCell>
                <TableCell>{stylist.role}</TableCell>
                <TableCell>{stylist.specialties}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

