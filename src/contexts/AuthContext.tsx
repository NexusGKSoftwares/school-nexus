import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import  FacultyModal  from "@/components/modals/FacultyModal"
import  DeleteConfirmModal from "@/components/modals/DeleteConfirmModal"
import { useToast } from "@/hooks/use-toast"

interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  role: 'admin' | 'lecturer' | 'student'
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string, role?: 'admin' | 'lecturer' | 'student') => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedFaculty, setSelectedFaculty] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return
      }

      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (
    email: string, 
    password: string, 
    fullName: string, 
    role: 'admin' | 'lecturer' | 'student' = 'student'
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    if (!error) {
      setProfile(prev => prev ? { ...prev, ...updates } : null)
    }

    return { error }
  }

  const handleCreateFaculty = () => {
    setSelectedFaculty(null)
    setIsFacultyModalOpen(true)
  }

  const handleEditFaculty = (faculty: any) => {
    setSelectedFaculty(faculty)
    setIsFacultyModalOpen(true)
  }

  const handleDeleteFaculty = (faculty: any) => {
    setSelectedFaculty(faculty)
    setIsDeleteModalOpen(true)
  }

  const handleSaveFaculty = async (data: any) => {
    setIsSubmitting(true)
    try {
      if (selectedFaculty) {
        // updateFaculty API call
        toast({ title: "Success", description: "Faculty updated successfully" })
      } else {
        // createFaculty API call
        toast({ title: "Success", description: "Faculty created successfully" })
      }
      setIsFacultyModalOpen(false)
      // refetch data
    } catch (err) {
      toast({ title: "Error", description: "Failed to save faculty", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    setIsSubmitting(true)
    try {
      // deleteFaculty API call
      toast({ title: "Success", description: "Faculty deleted successfully" })
      setIsDeleteModalOpen(false)
      // refetch data
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete faculty", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
      <FacultyModal
        isOpen={isFacultyModalOpen}
        onClose={() => setIsFacultyModalOpen(false)}
        onSave={handleSaveFaculty}
        faculty={selectedFaculty}
        isLoading={isSubmitting}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Faculty"
        description={`Are you sure you want to delete ${selectedFaculty?.name || 'this faculty'}? This action cannot be undone.`}
        isLoading={isSubmitting}
      />
    </AuthContext.Provider>
  )
} 