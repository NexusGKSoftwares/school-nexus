import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import FacultyModal from "@/components/modals/FacultyModal";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: "admin" | "lecturer" | "student";
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role?: "admin" | "lecturer" | "student",
    additionalData?: any
  ) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("Error getting session:", error);
        setLoading(false);
        return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    }).catch((error) => {
      console.error("Error in getSession:", error);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      
      // Add a timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
      );
      
      const fetchPromise = supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

      if (error) {
        console.error("Error fetching profile:", error);
        console.log("Error code:", error.code);
        console.log("Error message:", error.message);
        
        // If profile doesn't exist, try to create it
        // PGRST116 is "No rows returned" in newer versions
        // Some versions use different error codes
        if (error.code === 'PGRST116' || error.message?.includes('No rows returned') || error.message?.includes('not found')) {
          console.log("Profile not found, attempting to create one...");
          await createProfileFromUser(userId);
          return;
        }
        
        setLoading(false);
        return;
      }

      console.log("Profile fetched:", data);
      setProfile(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };

  const createProfileFromUser = async (userId: string) => {
    try {
      console.log("Creating profile for user:", userId);
      
      // Use the user data from the session
      const currentUser = user || session?.user;
      if (!currentUser) {
        console.error("No user data available");
        setLoading(false);
        return;
      }

      console.log("Current user data:", {
        id: currentUser.id,
        email: currentUser.email,
        metadata: currentUser.user_metadata
      });

      // Create profile with user metadata - use email as full_name if not available
      const email = currentUser.email || '';
      const fullName = currentUser.user_metadata?.full_name || email.split('@')[0] || 'User';
      const role = currentUser.user_metadata?.role || 'student';

      const profileData = {
        id: userId,
        email: email,
        full_name: fullName,
        role: role
      };

      console.log("Attempting to insert profile:", profileData);

      const { data: profileResult, error: profileError } = await supabase
        .from("profiles")
        .insert([profileData])
        .select()
        .single();

      if (profileError) {
        console.error("Error creating profile:", profileError);
        console.log("Profile error details:", {
          code: profileError.code,
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint
        });
        
        // Create a fallback profile so user can proceed
        const fallbackProfile = {
          id: userId,
          email: email,
          full_name: fullName,
          role: role,
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        console.log("Using fallback profile:", fallbackProfile);
        setProfile(fallbackProfile);
        setLoading(false);
        return;
      }

      console.log("Profile created successfully:", profileResult);
      setProfile(profileResult);
      setLoading(false);
    } catch (error) {
      console.error("Error creating profile from user:", error);
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting sign in for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        return { error };
      }

      console.log("Sign in successful:", data);
      return { error: null };
    } catch (error) {
      console.error("Sign in exception:", error);
      return { error };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: "admin" | "lecturer" | "student" = "student",
    additionalData?: any
  ) => {
    try {
      console.log("Attempting sign up for:", email, "with role:", role);
      
      // Use email as full_name if no full_name is provided
      const displayName = fullName || email.split('@')[0] || 'User';
      
      // Sign up the user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: displayName,
            role: role,
          },
        },
      });

      if (signUpError) {
        console.error("Sign up error:", signUpError);
        return { error: signUpError };
      }

      if (!signUpData.user) {
        console.error("No user returned from sign up");
        return { error: new Error("Sign up failed - no user returned") };
      }

      console.log("Sign up successful:", signUpData.user.id);

      // Wait a moment for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create role-specific records if additional data is provided
      if (additionalData && signUpData.user) {
        if (role === "student" && additionalData.studentData) {
          const { error: studentError } = await supabase
            .from("students")
            .insert([{
              profile_id: signUpData.user.id,
              student_number: additionalData.studentData.studentId || `STU${Date.now()}`,
              faculty_id: additionalData.studentData.facultyId,
              enrollment_date: new Date().toISOString().slice(0, 10),
              status: "active",
            }]);

          if (studentError) {
            console.error("Error creating student record:", studentError);
            // Don't fail the signup, just log the error
          }
        } else if (role === "lecturer" && additionalData.lecturerData) {
          const { error: lecturerError } = await supabase
            .from("lecturers")
            .insert([{
              profile_id: signUpData.user.id,
              employee_number: additionalData.lecturerData.employeeId || `EMP${Date.now()}`,
              faculty_id: additionalData.lecturerData.facultyId,
              hire_date: new Date().toISOString().slice(0, 10),
              status: "active",
            }]);

          if (lecturerError) {
            console.error("Error creating lecturer record:", lecturerError);
            // Don't fail the signup, just log the error
          }
        }
      }

      return { error: null };
    } catch (error) {
      console.error("Sign up exception:", error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
      }
    } catch (error) {
      console.error("Sign out exception:", error);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error("No user logged in") };

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (!error) {
      setProfile((prev) => (prev ? { ...prev, ...updates } : null));
    }

    return { error };
  };

  const handleCreateFaculty = () => {
    setSelectedFaculty(null);
    setIsFacultyModalOpen(true);
  };

  const handleEditFaculty = (faculty: any) => {
    setSelectedFaculty(faculty);
    setIsFacultyModalOpen(true);
  };

  const handleDeleteFaculty = (faculty: any) => {
    setSelectedFaculty(faculty);
    setIsDeleteModalOpen(true);
  };

  const handleSaveFaculty = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (selectedFaculty) {
        // updateFaculty API call
        toast({
          title: "Success",
          description: "Faculty updated successfully",
        });
      } else {
        // createFaculty API call
        toast({
          title: "Success",
          description: "Faculty created successfully",
        });
      }
      setIsFacultyModalOpen(false);
      // refetch data
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save faculty",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsSubmitting(true);
    try {
      // deleteFaculty API call
      toast({ title: "Success", description: "Faculty deleted successfully" });
      setIsDeleteModalOpen(false);
      // refetch data
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete faculty",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <FacultyModal
        isOpen={isFacultyModalOpen}
        onClose={() => setIsFacultyModalOpen(false)}
        onSave={handleSaveFaculty}
        faculty={selectedFaculty}
        isLoading={isSubmitting}
        mode={"create"}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Faculty"
        description={`Are you sure you want to delete ${selectedFaculty?.name || "this faculty"}? This action cannot be undone.`}
        isLoading={isSubmitting}
        itemName={""}
      />
    </AuthContext.Provider>
  );
};
