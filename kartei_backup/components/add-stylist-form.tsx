"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

const stylistSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number must be at least 5 characters"),
  role: z.enum(["junior", "senior", "manager"]),
  specialties: z.string().optional(),
})

type StylistFormValues = z.infer<typeof stylistSchema>

export function AddStylistForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<StylistFormValues>({
    resolver: zodResolver(stylistSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "junior",
      specialties: "",
    },
  })

  async function onSubmit(data: StylistFormValues) {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    console.log(data)
    toast({
      title: "Stylist added",
      description: "The new stylist has been added successfully.",
    })
    form.reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Stylist</CardTitle>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...form.register("phone")} />
            {form.formState.errors.phone && (
              <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={(value) => form.setValue("role", value as "junior" | "senior" | "manager")}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="junior">Junior Stylist</SelectItem>
                <SelectItem value="senior">Senior Stylist</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialties">Specialties (optional)</Label>
            <Input id="specialties" {...form.register("specialties")} />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Stylist"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

