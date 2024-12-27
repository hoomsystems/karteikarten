"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AllClients() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStylist, setSelectedStylist] = useState("all")

  const filteredClients = clients
    .filter((client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((client) =>
      selectedStylist === "all" ? true : client.stylist === selectedStylist
    )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 mb-4">
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={selectedStylist} onValueChange={setSelectedStylist}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by stylist" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stylists</SelectItem>
              <SelectItem value="John Doe">John Doe</SelectItem>
              <SelectItem value="Jane Smith">Jane Smith</SelectItem>
              <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead>Preferred Service</TableHead>
              <TableHead>Stylist</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={client.avatar} />
                      <AvatarFallback>
                        {client.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{client.name}</span>
                  </div>
                </TableCell>
                <TableCell>{client.lastVisit}</TableCell>
                <TableCell>{client.preferredService}</TableCell>
                <TableCell>{client.stylist}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

const clients = [
  {
    id: 1,
    name: "Sarah Johnson",
    lastVisit: "2 days ago",
    preferredService: "Haircut & Style",
    stylist: "John Doe",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    name: "Michael Chen",
    lastVisit: "1 week ago",
    preferredService: "Color Treatment",
    stylist: "Jane Smith",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    name: "Emma Davis",
    lastVisit: "3 days ago",
    preferredService: "Blowout",
    stylist: "Mike Johnson",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 4,
    name: "James Wilson",
    lastVisit: "2 weeks ago",
    preferredService: "Beard Trim",
    stylist: "John Doe",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

