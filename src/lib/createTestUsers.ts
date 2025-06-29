import { supabase } from "./supabase";

export async function createTestUsers() {
  console.log("Creating test users...");

  const testUsers = [
    {
      email: "admin@school.com",
      password: "admin123",
      fullName: "Admin User",
      role: "admin" as const,
    },
    {
      email: "student@school.com",
      password: "student123",
      fullName: "Student User",
      role: "student" as const,
    },
    {
      email: "lecturer@school.com",
      password: "lecturer123",
      fullName: "Lecturer User",
      role: "lecturer" as const,
    },
  ];

  const results = [];

  for (const user of testUsers) {
    try {
      console.log(`Creating user: ${user.email}`);
      
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            full_name: user.fullName,
            role: user.role,
          },
        },
      });

      if (error) {
        console.error(`Error creating ${user.email}:`, error);
        results.push({ email: user.email, success: false, error });
      } else {
        console.log(`Successfully created ${user.email}:`, data.user?.id);
        results.push({ email: user.email, success: true, userId: data.user?.id });
      }

      // Wait a bit between user creations
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      console.error(`Exception creating ${user.email}:`, err);
      results.push({ email: user.email, success: false, error: err });
    }
  }

  console.log("Test user creation complete:", results);
  return results;
}

export async function testLogin(email: string, password: string) {
  try {
    console.log(`Testing login for: ${email}`);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(`Login error for ${email}:`, error);
      return { success: false, error };
    } else {
      console.log(`Login successful for ${email}:`, data.user?.id);
      return { success: true, user: data.user };
    }
  } catch (err) {
    console.error(`Login exception for ${email}:`, err);
    return { success: false, error: err };
  }
}

// Test credentials
export const TEST_CREDENTIALS = {
  admin: { email: "admin@school.com", password: "admin123" },
  student: { email: "student@school.com", password: "student123" },
  lecturer: { email: "lecturer@school.com", password: "lecturer123" },
}; 