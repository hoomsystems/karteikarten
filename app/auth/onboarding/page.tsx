import { OnboardingForm } from "@/components/auth/onboarding-form"

export default function OnboardingPage({
  searchParams,
}: {
  searchParams: { userId: string }
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Completa tu registro</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Ingresa los datos de tu empresa
        </p>
      </div>
      <OnboardingForm userId={searchParams.userId} />
    </div>
  )
}