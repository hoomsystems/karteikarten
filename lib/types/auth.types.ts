export interface AuthUser {
    id: string
    email: string
    first_name?: string
    last_name?: string
    role?: 'admin' | 'stylist'
  }
  
  export interface UserOnboarding {
    first_name: string
    last_name: string
    company_name: string
    role: 'admin' | 'stylist'
    phone?: string
  }
  
  export interface LoginInput {
    email: string
    password: string
  }
  
  export interface RegisterInput extends LoginInput {
    confirmPassword: string
  }
  
  export interface AuthError {
    message: string
    status?: number
  }
  
  export interface AuthResponse {
    user: AuthUser | null
    error: AuthError | null
  }