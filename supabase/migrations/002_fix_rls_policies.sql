-- Fix RLS policies to allow authentication and profile creation

-- Drop conflicting policies
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Allow profile creation by trigger" ON profiles;

-- Recreate the profile creation policy with broader permissions
CREATE POLICY "Allow profile creation by trigger" ON profiles
    FOR INSERT WITH CHECK (true);

-- Allow users to create their own profile if it doesn't exist
CREATE POLICY "Allow users to create own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Allow admins to update all profiles
CREATE POLICY "Admins can update all profiles" ON profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Add policies to allow student/lecturer creation during signup
DROP POLICY IF EXISTS "Allow student creation during signup" ON students;
CREATE POLICY "Allow student creation during signup" ON students
    FOR INSERT WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "Allow lecturer creation during signup" ON lecturers;
CREATE POLICY "Allow lecturer creation during signup" ON lecturers
    FOR INSERT WITH CHECK (profile_id = auth.uid());

-- Ensure faculties are viewable by everyone (needed for signup forms)
DROP POLICY IF EXISTS "Everyone can view faculties" ON faculties;
CREATE POLICY "Everyone can view faculties" ON faculties
    FOR SELECT USING (true);

-- Update admin policies to be more permissive
DROP POLICY IF EXISTS "Admins can manage faculties" ON faculties;
CREATE POLICY "Admins can manage faculties" ON faculties
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Update the handle_new_user function to be more robust and handle errors
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Try to insert the profile, but don't fail if it already exists
    BEGIN
        INSERT INTO profiles (id, email, full_name, role)
        VALUES (
            NEW.id,
            NEW.email,
            COALESCE(
                NEW.raw_user_meta_data->>'full_name',
                SPLIT_PART(NEW.email, '@', 1),
                'User'
            ),
            COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
        );
    EXCEPTION
        WHEN unique_violation THEN
            -- Profile already exists, that's fine
            NULL;
        WHEN OTHERS THEN
            -- Log the error but don't fail the user creation
            RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION handle_new_user();
  END IF;
END $$; 