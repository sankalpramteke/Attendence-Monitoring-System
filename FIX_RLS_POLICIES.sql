-- Fix RLS Policies for Users Table
-- This script fixes the infinite recursion error

-- First, drop the problematic policies
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins and HODs can view all faculty" ON public.faculty;
DROP POLICY IF EXISTS "Admins and HODs can view all attendance" ON public.attendance;

-- Create new simplified policies for users table
CREATE POLICY "Authenticated users can view all users" ON public.users
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can manage all users" ON public.users
    FOR ALL USING (auth.role() = 'service_role');

-- Create new simplified policies for faculty table
CREATE POLICY "Authenticated users can view all faculty" ON public.faculty
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Service role can manage all faculty" ON public.faculty
    FOR ALL USING (auth.role() = 'service_role');

-- Create new simplified policies for attendance table
CREATE POLICY "Authenticated users can view all attendance" ON public.attendance
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Service role can manage all attendance" ON public.attendance
    FOR ALL USING (auth.role() = 'service_role');

-- Verify the policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('users', 'faculty', 'attendance')
ORDER BY tablename, policyname; 