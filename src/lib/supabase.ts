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
      faculties: { Row: any; Insert: any; Update: any };
      students: { Row: any; Insert: any; Update: any };
      lecturers: { Row: any; Insert: any; Update: any };
      courses: { Row: any; Insert: any; Update: any };
      enrollments: { Row: any; Insert: any; Update: any };
      announcements: { Row: any; Insert: any; Update: any };
      payments: { Row: any; Insert: any; Update: any };
    };
  };
};

// Create the client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
