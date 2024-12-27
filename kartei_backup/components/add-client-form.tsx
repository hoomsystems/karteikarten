"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

const clientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  telephone: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  maritalStatus: z.enum(["single", "married"]).optional(),
  partnerName: z.string().optional(),
  hasChildren: z.boolean().optional(),
  children: z.array(z.object({
    name: z.string(),
    age: z.number().positive().int()
  })).optional(),
  preferredDrink: z.string().optional(),
})

type ClientFormValues = z.infer<typeof clientSchema>

export function AddClientForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      lastName: "",
      telephone: "",
      email: "",
      maritalStatus: undefined,
      partnerName: "",
      hasChildren: false,
      children: [],
      preferredDrink: "",
    },
  })

  async function onSubmit(data: ClientFormValues) {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    console.log(data)
    toast({
      title: "Client added successfully",
      description: "The new client has been added to your database.",
    })
    form.reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Information</CardTitle>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...form.register("lastName")} />
              {form.formState.errors.lastName && (
                <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telephone">Telephone (optional)</Label>
              <Input id="telephone" {...form.register("telephone")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input id="email" type="email" {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Marital Status (optional)</Label>
            <RadioGroup onValueChange={(value) => form.setValue("maritalStatus", value as "single" | "married")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="single" id="single" />
                <Label htmlFor="single">Single</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="married" id="married" />
                <Label htmlFor="married">Married</Label>
              </div>
            </RadioGroup>
          </div>
          {form.watch("maritalStatus") === "married" && (
            <div className="space-y-2">
              <Label htmlFor="partnerName">Partner's Name (optional)</Label>
              <Input id="partnerName" {...form.register("partnerName")} />
            </div>
          )}
          <div className="space-y-2">
            <Label>Do you have children?</Label>
            <Select onValueChange={(value) => form.setValue("hasChildren", value === "yes")}>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {form.watch("hasChildren") && (
            <div className="space-y-2">
              <Label>Children (Name and Age)</Label>
              {form.watch("children")?.map((child, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    placeholder="Name"
                    {...form.register(`children.${index}.name` as const)}
                  />
                  <Input
                    type="number"
                    placeholder="Age"
                    {...form.register(`children.${index}.age` as const, { valueAsNumber: true })}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const children = form.getValues("children") || []
                  form.setValue("children", [...children, { name: "", age: 0 }])
                }}
              >
                Add Child
              </Button>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="preferredDrink">Preferred Drink (optional)</Label>
            <Input id="preferredDrink" {...form.register("preferredDrink")} />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Client"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

