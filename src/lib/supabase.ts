/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          role: 'admin' | 'lecturer' | 'student'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          role: 'admin' | 'lecturer' | 'student'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          role?: 'admin' | 'lecturer' | 'student'
          created_at?: string
          updated_at?: string
        }
      }
      assignments: { Row: any; Insert: any; Update: any }
      materials: { Row: any; Insert: any; Update: any }
      quizzes: { Row: any; Insert: any; Update: any }
      grades: { Row: any; Insert: any; Update: any }
      attendance: { Row: any; Insert: any; Update: any }
      support_tickets: { Row: any; Insert: any; Update: any }
      scholarships: { Row: any; Insert: any; Update: any }
      refunds: { Row: any; Insert: any; Update: any }
      tuition_fees: { Row: any; Insert: any; Update: any }
      exams: { Row: any; Insert: any; Update: any }
      registrations: { Row: any; Insert: any; Update: any }
      staff: { Row: any; Insert: any; Update: any }
      calendar_events: { Row: any; Insert: any; Update: any }
      faculties: { Row: any; Insert: any; Update: any }
      students: { Row: any; Insert: any; Update: any }
      lecturers: { Row: any; Insert: any; Update: any }
      courses: { Row: any; Insert: any; Update: any }
      enrollments: { Row: any; Insert: any; Update: any }
      announcements: { Row: any; Insert: any; Update: any }
      payments: { Row: any; Insert: any; Update: any }
    }
  }
}