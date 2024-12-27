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

const venues = [
  {
    id: 1,
    name: "Downtown Salon",
    address: "123 Main St, Cityville, ST 12345",
    phone: "(123) 456-7890",
    website: "https://downtownsalon.com",
  },
  {
    id: 2,
    name: "Uptown Beauty",
    address: "456 Oak Ave, Townsburg, ST 67890",
    phone: "(987) 654-3210",
    website: "https://uptownbeauty.com",
  },
  // Add more sample venues as needed
]

export function VenuesList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Venues</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {venues.map((venue) => (
              <TableRow key={venue.id}>
                <TableCell>{venue.name}</TableCell>
                <TableCell>{venue.address}</TableCell>
                <TableCell>{venue.phone}</TableCell>
                <TableCell>
                  <a href={venue.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {venue.website}
                  </a>
                </TableCell>
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

