import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
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
      faculties: {
        Row: {
          id: string
          name: string
          code: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          code: string
          description: string | null
          credits: number
          faculty_id: string
          lecturer_id: string | null
          semester: number
          academic_year: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          code: string
          description?: string | null
          credits: number
          faculty_id: string
          lecturer_id?: string | null
          semester: number
          academic_year: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          code?: string
          description?: string | null
          credits?: number
          faculty_id?: string
          lecturer_id?: string | null
          semester?: number
          academic_year?: string
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          profile_id: string
          student_number: string
          faculty_id: string
          enrollment_date: string
          graduation_date: string | null
          status: 'active' | 'graduated' | 'suspended' | 'withdrawn'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          student_number: string
          faculty_id: string
          enrollment_date: string
          graduation_date?: string | null
          status?: 'active' | 'graduated' | 'suspended' | 'withdrawn'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          student_number?: string
          faculty_id?: string
          enrollment_date?: string
          graduation_date?: string | null
          status?: 'active' | 'graduated' | 'suspended' | 'withdrawn'
          created_at?: string
          updated_at?: string
        }
      }
      lecturers: {
        Row: {
          id: string
          profile_id: string
          employee_number: string
          faculty_id: string
          hire_date: string
          specialization: string | null
          status: 'active' | 'inactive' | 'on_leave'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          employee_number: string
          faculty_id: string
          hire_date: string
          specialization?: string | null
          status?: 'active' | 'inactive' | 'on_leave'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          employee_number?: string
          faculty_id?: string
          hire_date?: string
          specialization?: string | null
          status?: 'active' | 'inactive' | 'on_leave'
          created_at?: string
          updated_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          student_id: string
          course_id: string
          enrollment_date: string
          status: 'enrolled' | 'completed' | 'dropped' | 'failed'
          grade: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          course_id: string
          enrollment_date: string
          status?: 'enrolled' | 'completed' | 'dropped' | 'failed'
          grade?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          course_id?: string
          enrollment_date?: string
          status?: 'enrolled' | 'completed' | 'dropped' | 'failed'
          grade?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      announcements: {
        Row: {
          id: string
          title: string
          content: string
          author_id: string
          target_audience: 'all' | 'students' | 'lecturers' | 'admins'
          is_published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          author_id: string
          target_audience?: 'all' | 'students' | 'lecturers' | 'admins'
          is_published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          author_id?: string
          target_audience?: 'all' | 'students' | 'lecturers' | 'admins'
          is_published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          student_id: string
          amount: number
          payment_type: 'tuition' | 'library_fine' | 'other'
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_date: string | null
          due_date: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          amount: number
          payment_type?: 'tuition' | 'library_fine' | 'other'
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_date?: string | null
          due_date: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          amount?: number
          payment_type?: 'tuition' | 'library_fine' | 'other'
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_date?: string | null
          due_date?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
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