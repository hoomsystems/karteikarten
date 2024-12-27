import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Crear cuenta</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Ingresa tus datos para registrarte
        </p>
      </div>
      <RegisterForm />
    </div>
  )
}