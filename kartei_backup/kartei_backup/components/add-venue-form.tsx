"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

const venueSchema = z.object({
  name: z.string().min(2, "Venue name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  phone: z.string().min(5, "Phone number must be at least 5 characters"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  facebook: z.string().url("Invalid Facebook URL").optional().or(z.literal("")),
  instagram: z.string().url("Invalid Instagram URL").optional().or(z.literal("")),
  twitter: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),
})

type VenueFormValues = z.infer<typeof venueSchema>

export function AddVenueForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<VenueFormValues>({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      website: "",
      facebook: "",
      instagram: "",
      twitter: "",
    },
  })

  async function onSubmit(data: VenueFormValues) {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    console.log(data)
    toast({
      title: "Venue added",
      description: "The new venue has been added successfully.",
    })
    form.reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Venue</CardTitle>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Venue Name</Label>
            <Input id="name" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...form.register("address")} />
            {form.formState.errors.address && (
              <p className="text-sm text-red-500">{form.formState.errors.address.message}</p>
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
            <Label htmlFor="website">Website (optional)</Label>
            <Input id="website" {...form.register("website")} />
            {form.formState.errors.website && (
              <p className="text-sm text-red-500">{form.formState.errors.website.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook (optional)</Label>
            <Input id="facebook" {...form.register("facebook")} />
            {form.formState.errors.facebook && (
              <p className="text-sm text-red-500">{form.formState.errors.facebook.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram (optional)</Label>
            <Input id="instagram" {...form.register("instagram")} />
            {form.formState.errors.instagram && (
              <p className="text-sm text-red-500">{form.formState.errors.instagram.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter (optional)</Label>
            <Input id="twitter" {...form.register("twitter")} />
            {form.formState.errors.twitter && (
              <p className="text-sm text-red-500">{form.formState.errors.twitter.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Venue"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

