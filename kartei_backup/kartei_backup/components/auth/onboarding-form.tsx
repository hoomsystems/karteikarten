"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { onboardingSchema, type OnboardingInput } from "@/lib/validations/auth"

export function OnboardingForm({ userId }: { userId: string }) {
  const router = useRouter()
  const { completeOnboarding, loading } = useAuth()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      role: "admin",
    },
  })

  const onSubmit = async (data: OnboardingInput) => {
    try {
      await completeOnboarding(userId, data)
      router.push("/")
    } catch (err) {
      setError("root", {
        message: "Error al completar el registro. Por favor intenta de nuevo.",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="first_name" className="text-sm font-medium">
          Nombre
        </label>
        <Input
          id="first_name"
          {...register("first_name")}
          aria-invalid={!!errors.first_name}
        />
        {errors.first_name && (
          <p className="text-sm text-red-500">{errors.first_name.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <label htmlFor="last_name" className="text-sm font-medium">
          Apellido
        </label>
        <Input
          id="last_name"
          {...register("last_name")}
          aria-invalid={!!errors.last_name}
        />
        {errors.last_name && (
          <p className="text-sm text-red-500">{errors.last_name.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <label htmlFor="company_name" className="text-sm font-medium">
          Nombre de la Empresa
        </label>
        <Input
          id="company_name"
          {...register("company_name")}
          aria-invalid={!!errors.company_name}
        />
        {errors.company_name && (
          <p className="text-sm text-red-500">{errors.company_name.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">
          Teléfono
        </label>
        <Input
          id="phone"
          type="tel"
          {...register("phone")}
          aria-invalid={!!errors.phone}
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>
      {errors.root && (
        <p className="text-sm text-red-500">{errors.root.message}</p>
      )}
      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? "Completando registro..." : "Completar registro"}
      </Button>
    </form>
  )
}