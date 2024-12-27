export interface Database {
    public: {
      Tables: {
        appointments: {
          Row: Appointment
          Insert: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>
          Update: Partial<Appointment>
        }
        appointment_services: {
          Row: AppointmentService
          Insert: Omit<AppointmentService, 'id' | 'created_at'>
          Update: Partial<AppointmentService>
        }
        files: {
          Row: File
          Insert: Omit<File, 'id' | 'created_at'>
          Update: Partial<File>
        }
        clients: {
          Row: Client
          Insert: Omit<Client, 'id' | 'created_at' | 'updated_at'>
          Update: Partial<Client>
        }
        venues: {
          Row: Venue
          Insert: Omit<Venue, 'id' | 'created_at' | 'updated_at'>
          Update: Partial<Venue>
        }
        stylists: {
          Row: Stylist
          Insert: Omit<Stylist, 'id' | 'created_at' | 'updated_at'>
          Update: Partial<Stylist>
        }
        companies: {
          Row: Company
          Insert: Omit<Company, 'id' | 'created_at' | 'updated_at'>
          Update: Partial<Company>
        }
      }
      Views: {
        [_ in never]: never
      }
      Functions: {
        [_ in never]: never
      }
      Enums: {
        [_ in never]: never
      }
    }
  }

export interface Appointment {
  id: string
  created_at: string
  updated_at: string
  client_id: string
  stylist_id: string
  venue_id: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes?: string
  total_amount?: number
}

export interface AppointmentService {
  id: string
  created_at: string
  appointment_id: string
  service_id: string
  price: number
  notes?: string
}

export interface File {
  id: string
  created_at: string
  name: string
  size: number
  type: string
  url: string
  appointment_id?: string
  client_id?: string
}

export interface Service {
  id: string
  created_at: string
  updated_at: string
  name: string
  description?: string
  duration: number
  price: number
  venue_id: string
}

export interface Client {
  id: string
  created_at: string
  updated_at: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  notes?: string
  venue_id: string
}

export interface Venue {
  id: string
  created_at: string
  updated_at: string
  name: string
  address?: string
  phone?: string
  email?: string
  owner_id: string
}

export interface Stylist {
  id: string
  created_at: string
  updated_at: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  venue_id: string
  role: 'admin' | 'stylist'
}

export interface Company {
  id: string
  created_at: string
  updated_at: string
  name: string
  address?: string
  phone?: string
  email?: string
  owner_id: string
  logo_url?: string
  settings?: {
    business_hours?: {
      [key: string]: {
        open: string
        close: string
        is_closed: boolean
      }
    }
    timezone?: string
    currency?: string
    appointment_duration?: number
  }
}