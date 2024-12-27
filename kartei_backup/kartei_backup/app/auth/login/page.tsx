import React from "react"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Iniciar sesión</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Ingresa tus credenciales para acceder
        </p>
      </div>
      <LoginForm />
    </div>
  )
}