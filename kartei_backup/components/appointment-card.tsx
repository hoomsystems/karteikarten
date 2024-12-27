"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { X } from 'lucide-react'

const appointmentSchema = z.object({
  date: z.string(),
  stylist: z.string(),
  services: z.array(z.string()),
  customService: z.string().optional(),
  formulation: z.string(),
  treatments: z.string(),
  productsUsed: z.string(),
  notes: z.string(),
  clientDrink: z.string(),
  conversationTopics: z.string(),
  productsBought: z.string(),
  interestedInFollowUps: z.boolean(),
})

type AppointmentFormValues = z.infer<typeof appointmentSchema>

interface AppointmentCardProps {
  clientName: string
  onClose: () => void
}

export function AppointmentCard({ clientName, onClose }: AppointmentCardProps) {
  const [beforeImage, setBeforeImage] = useState<File | null>(null)
  const [afterImage, setAfterImage] = useState<File | null>(null)
  const [showCustomService, setShowCustomService] = useState(false)

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: "",
      stylist: "",
      services: [],
      customService: "",
      formulation: "",
      treatments: "",
      productsUsed: "",
      notes: "",
      clientDrink: "",
      conversationTopics: "",
      productsBought: "",
      interestedInFollowUps: false,
    },
  })

  function onSubmit(data: AppointmentFormValues) {
    console.log(data)
    console.log("Before Image:", beforeImage)
    console.log("After Image:", afterImage)
    toast({
      title: "Appointment added successfully",
      description: "The appointment details have been saved.",
    })
    onClose()
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, setImage: (file: File | null) => void) => {
    const file = event.target.files?.[0]
    if (file) {
      setImage(file)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>New Appointment for {clientName}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...form.register("date")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stylist">Stylist</Label>
              <Select onValueChange={(value) => form.setValue("stylist", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stylist" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stylist1">Stylist 1</SelectItem>
                  <SelectItem value="stylist2">Stylist 2</SelectItem>
                  <SelectItem value="stylist3">Stylist 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="services">Services</Label>
            <Controller
              name="services"
              control={form.control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    if (value === "custom") {
                      setShowCustomService(true)
                    } else {
                      field.onChange([...field.value, value])
                      setShowCustomService(false)
                    }
                  }}
                  value={field.value[field.value.length - 1]}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="haircut">Haircut</SelectItem>
                    <SelectItem value="coloring">Coloring</SelectItem>
                    <SelectItem value="styling">Styling</SelectItem>
                    <SelectItem value="treatment">Treatment</SelectItem>
                    <SelectItem value="custom">Custom Service</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {showCustomService && (
              <div className="mt-2">
                <Input
                  placeholder="Enter custom service"
                  {...form.register("customService")}
                  onBlur={(e) => {
                    if (e.target.value) {
                      form.setValue("services", [...form.getValues("services"), e.target.value])
                      setShowCustomService(false)
                      e.target.value = ""
                    }
                  }}
                />
              </div>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {form.watch("services").map((service, index) => (
                <div key={index} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
                  {service}
                  <button
                    type="button"
                    className="ml-2 text-secondary-foreground hover:text-primary"
                    onClick={() => {
                      const services = form.getValues("services")
                      services.splice(index, 1)
                      form.setValue("services", services)
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="formulation">Formulation</Label>
            <Textarea id="formulation" {...form.register("formulation")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="treatments">Treatments</Label>
            <Textarea id="treatments" {...form.register("treatments")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="productsUsed">Products Used</Label>
            <Textarea id="productsUsed" {...form.register("productsUsed")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" {...form.register("notes")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientDrink">Client's Drink</Label>
            <Input id="clientDrink" {...form.register("clientDrink")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="conversationTopics">Conversation Topics</Label>
            <Textarea id="conversationTopics" {...form.register("conversationTopics")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="beforeImage">Before Picture</Label>
              <Input
                id="beforeImage"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setBeforeImage)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="afterImage">After Picture</Label>
              <Input
                id="afterImage"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setAfterImage)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="productsBought">Products Bought</Label>
            <Textarea id="productsBought" {...form.register("productsBought")} />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="interestedInFollowUps"
              onCheckedChange={(checked) => form.setValue("interestedInFollowUps", checked as boolean)}
            />
            <Label htmlFor="interestedInFollowUps">Interested in follow-ups?</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Save Appointment</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

