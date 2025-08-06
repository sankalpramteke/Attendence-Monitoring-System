# Admin Setup Guide

## 🚀 Setting Up Admin User

Since we've integrated with Supabase authentication, you need to create an admin user in Supabase first.

### Step 1: Create Admin User in Supabase

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Navigate to Authentication**
   - Click on "Authentication" in the left sidebar
   - Click on "Users" tab

3. **Add New User**
   - Click "Add User" button
   - Fill in the details:
     - **Email**: `admin@college.edu` (or your preferred email)
     - **Password**: Choose a strong password
     - **Email Confirm**: Check this to auto-confirm the email

4. **Create User Profile**
   - After creating the user, go to the SQL Editor
   - Run this query to create the admin profile:

```sql
INSERT INTO users (id, email, full_name, role, department, created_at)
VALUES (
  'YOUR_USER_ID_HERE', -- Replace with the actual user ID from step 3
  'admin@college.edu',
  'System Administrator',
  'admin',
  'Administration',
  NOW()
);
```

### Step 2: Get User ID

1. **Find the User ID**
   - In Supabase Dashboard → Authentication → Users
   - Click on your admin user
   - Copy the UUID (User ID)

2. **Update the SQL Query**
   - Replace `'YOUR_USER_ID_HERE'` with the actual UUID

### Step 3: Test Login

1. **Start the Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Go to Login Page**
   - Visit: `http://localhost:5173/login`
   - Use your admin email and password

3. **Access Dashboard**
   - After successful login, you'll be redirected to the dashboard

## 🔧 Alternative: Quick Admin Creation

You can also create the admin user directly through the frontend by temporarily enabling registration:

1. **Enable Registration** (temporary)
   - Go to Supabase Dashboard → Authentication → Settings
   - Enable "Enable email confirmations" (if not already enabled)
   - Enable "Enable sign ups" (temporary)

2. **Register Admin**
   - Visit: `http://localhost:5173/register`
   - Create account with admin role

3. **Disable Registration** (security)
   - Go back to Supabase Dashboard → Authentication → Settings
   - Disable "Enable sign ups"

## 🛡️ Security Notes

- **Strong Password**: Use a strong, unique password for admin account
- **Email Verification**: Ensure admin email is verified
- **Disable Registration**: Keep registration disabled in production
- **Regular Backups**: Backup your Supabase data regularly

## 🎯 Next Steps

After setting up admin login:

1. **Login to the system**
2. **Register faculty members** through the Faculty Registration form
3. **Create schedules** for classes
4. **Test attendance tracking**

## 📞 Support

If you encounter any issues:
1. Check Supabase logs in the dashboard
2. Verify environment variables are correct
3. Ensure all tables are created properly 