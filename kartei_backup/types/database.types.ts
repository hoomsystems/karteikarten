export type Timestamp = string

export interface BaseEntity {
  created_at: Timestamp
  updated_at: Timestamp
}

export interface Company extends BaseEntity {
  id: string
  name: string
  address?: string
  phone?: string
  email?: string
}

export interface Venue extends BaseEntity {
  id: string
  company_id: string
  name: string
  address?: string
  phone?: string
  email?: string
}

export interface Client extends BaseEntity {
  id: string
  company_id: string
  venue_id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  birth_date?: string
  preferred_beverage?: string
  notes?: string
}

export interface Appointment extends BaseEntity {
  id: string
  client_id: string
  stylist_id: string
  venue_id: string
  date: Timestamp
  status: string
  notes?: string
}

export interface AppointmentService extends BaseEntity {
  id: string
  appointment_id: string
  service_name: string
  notes?: string
}

export interface File {
  id: string
  appointment_id: string
  file_type: string
  file_url: string
  transcription?: string
  created_at: Timestamp
}