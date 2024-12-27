export interface AuthUser {
    id: string
    email: string
  }
  
  export interface UserOnboarding {
    first_name: string
    last_name: string
    company_name: string
    role: 'admin' | 'stylist'
    phone?: string
  }