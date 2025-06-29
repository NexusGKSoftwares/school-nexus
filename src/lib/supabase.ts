import { createClient } from "@supabase/supabase-js";

// Supabase credentials (HARD-CODED)
const supabaseUrl = "https://uxcdegbnkknmtbbsxhqz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4Y2RlZ2Jua2tubXRiYnN4aHF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwOTU2MDgsImV4cCI6MjA2NjY3MTYwOH0.sNSxWQY_M_b5nUgo4dDDXG2FLea9VokjglK8rCUfKLQ"
  
// Validate credentials
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase credentials are missing!");
  throw new Error("Missing Supabase URL or Anon Key");
}

// Define database types (extend as needed)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          role: "admin" | "lecturer" | "student";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          role: "admin" | "lecturer" | "student";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["profiles"]["Row"], "id">>;
      };
      
      faculties: {
        Row: {
          id: string;
          name: string;
          code: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["faculties"]["Row"], "id">>;
      };

      students: {
        Row: {
          id: string;
          profile_id: string;
          student_number: string;
          faculty_id: string;
          enrollment_date: string;
          graduation_date: string | null;
          status: "active" | "graduated" | "suspended" | "withdrawn";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          student_number: string;
          faculty_id: string;
          enrollment_date: string;
          graduation_date?: string | null;
          status?: "active" | "graduated" | "suspended" | "withdrawn";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["students"]["Row"], "id">>;
      };

      lecturers: {
        Row: {
          id: string;
          profile_id: string;
          employee_number: string;
          faculty_id: string;
          hire_date: string;
          specialization: string | null;
          status: "active" | "inactive" | "on_leave";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          employee_number: string;
          faculty_id: string;
          hire_date: string;
          specialization?: string | null;
          status?: "active" | "inactive" | "on_leave";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["lecturers"]["Row"], "id">>;
      };

      courses: {
        Row: {
          id: string;
          title: string;
          code: string;
          description: string | null;
          credits: number;
          faculty_id: string;
          lecturer_id: string | null;
          semester: number;
          academic_year: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          code: string;
          description?: string | null;
          credits: number;
          faculty_id: string;
          lecturer_id?: string | null;
          semester: number;
          academic_year: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["courses"]["Row"], "id">>;
      };

      enrollments: {
        Row: {
          id: string;
          student_id: string;
          course_id: string;
          enrollment_date: string;
          status: "enrolled" | "completed" | "dropped" | "failed";
          grade: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          course_id: string;
          enrollment_date: string;
          status?: "enrolled" | "completed" | "dropped" | "failed";
          grade?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["enrollments"]["Row"], "id">>;
      };

      announcements: {
        Row: {
          id: string;
          title: string;
          content: string;
          author_id: string;
          target_audience: "all" | "students" | "lecturers" | "admins";
          is_published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          author_id: string;
          target_audience?: "all" | "students" | "lecturers" | "admins";
          is_published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["announcements"]["Row"], "id">>;
      };

      payments: {
        Row: {
          id: string;
          student_id: string;
          amount: number;
          payment_type: "tuition" | "library_fine" | "other";
          status: "pending" | "completed" | "failed" | "refunded";
          payment_date: string | null;
          due_date: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          amount: number;
          payment_type?: "tuition" | "library_fine" | "other";
          status?: "pending" | "completed" | "failed" | "refunded";
          payment_date?: string | null;
          due_date: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["payments"]["Row"], "id">>;
      };
      
      // Extend other tables as needed
      assignments: { Row: any; Insert: any; Update: any };
      materials: { Row: any; Insert: any; Update: any };
      quizzes: { Row: any; Insert: any; Update: any };
      grades: { Row: any; Insert: any; Update: any };
      attendance: { Row: any; Insert: any; Update: any };
      support_tickets: { Row: any; Insert: any; Update: any };
      scholarships: { Row: any; Insert: any; Update: any };
      refunds: { Row: any; Insert: any; Update: any };
      tuition_fees: { Row: any; Insert: any; Update: any };
      exams: { Row: any; Insert: any; Update: any };
      registrations: { Row: any; Insert: any; Update: any };
      staff: { Row: any; Insert: any; Update: any };
      calendar_events: { Row: any; Insert: any; Update: any };
    };
  };
};

// Create the client with localStorage to prevent SecurityError
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
