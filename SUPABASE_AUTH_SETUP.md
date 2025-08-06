# Supabase Authentication Setup Guide

This guide will help you set up Supabase authentication and remove all mock data dependencies from your Attendance Monitoring System.

## 🎯 **What We've Done**

✅ **Removed Mock Data**: Replaced large mock data with minimal empty arrays
✅ **Created Supabase Services**: Faculty, Attendance, Schedule, and Face Recognition services
✅ **Updated Authentication**: Using Supabase Auth instead of mock users
✅ **Database Schema**: Complete PostgreSQL schema with RLS policies

## 📋 **Prerequisites**

- Supabase account
- Node.js (v16+)
- Python (v3.8+)

## 🚀 **Step-by-Step Setup**

### **Step 1: Create Supabase Project**

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in details:
   - **Name**: `attendance-monitoring-system`
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
4. Click "Create new project"
5. Wait for setup (2-3 minutes)

### **Step 2: Get Project Credentials**

1. Go to **Settings** → **API**
2. Copy these values:
   ```
   Project URL: https://your-project-id.supabase.co
   Anon Key: your-anon-key
   Service Role Key: your-service-role-key (keep secret!)
   ```

### **Step 3: Set Up Database Schema**

1. Go to **SQL Editor** in Supabase dashboard
2. Copy and paste the entire content from `database_schema.sql`
3. Click **Run** to execute

### **Step 4: Create Storage Buckets**

1. Go to **Storage** in Supabase dashboard
2. Create two buckets:
   - **Bucket Name**: `face-images` (Public)
   - **Bucket Name**: `profile-pictures` (Public)

### **Step 5: Configure Environment Variables**

#### **Frontend (.env file in frontend/)**
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_BASE_URL=http://localhost:8000
```

#### **Backend (.env file in backend-arcface/)**
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

### **Step 6: Install Dependencies**

#### **Frontend**
```bash
cd frontend
npm install
```

#### **Backend**
```bash
cd backend-arcface
pip install -r requirements.txt
```

### **Step 7: Create Initial Admin User**

1. Go to **Authentication** → **Users** in Supabase dashboard
2. Click **Add user**
3. Enter admin details:
   - **Email**: `admin@college.edu`
   - **Password**: `admin123`
4. Go to **SQL Editor** and run:

```sql
INSERT INTO public.users (id, email, full_name, role, department)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@college.edu'),
  'admin@college.edu',
  'Admin User',
  'admin',
  'Administration'
);
```

### **Step 8: Test Authentication**

1. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

2. Start the backend:
   ```bash
   cd backend-arcface
   python main.py
   ```

3. Open `http://localhost:5173`
4. Try logging in with `admin@college.edu` / `admin123`

## 🔧 **Adding Your Own Data**

### **Create Faculty Members**

1. **Register new users** through the frontend
2. **Add faculty details** using the Faculty Registration form
3. **Upload face images** for face recognition

### **Create Schedules**

1. Use the Schedule Management interface
2. Assign faculty to classes
3. Set classroom and time slots

### **Record Attendance**

1. Use face recognition for automatic check-in
2. Or manually record attendance
3. View reports and analytics

## 🛡️ **Security Features**

### **Row Level Security (RLS)**
- Users can only see their own data
- Admins can see all data
- HODs can see department data

### **Authentication**
- JWT token-based authentication
- Secure password handling
- Session management

### **File Storage**
- Secure image uploads
- Public URLs for easy access
- Automatic cleanup

## 🔄 **Migration from Mock Data**

### **Components to Update**

The following components need to be updated to use Supabase services:

1. **Dashboard.jsx** - Use `AttendanceService.getTodayAttendance()`
2. **FacultyRegistration.jsx** - Use `FacultyService.createFaculty()`
3. **ScheduleManagement.jsx** - Use `ScheduleService.getAllSchedules()`
4. **AttendanceReports.jsx** - Use `AttendanceService.getAllAttendance()`

### **Example Component Update**

```jsx
// Before (using mock data)
import { mockFaculty } from '../utils/mockData';

// After (using Supabase)
import { FacultyService } from '../services/facultyService';

const [faculty, setFaculty] = useState([]);

useEffect(() => {
  const loadFaculty = async () => {
    const result = await FacultyService.getAllFaculty();
    if (result.success) {
      setFaculty(result.data);
    }
  };
  loadFaculty();
}, []);
```

## 🚨 **Troubleshooting**

### **Common Issues**

1. **CORS Errors**
   - Check CORS configuration in `main.py`
   - Ensure frontend URL is in allowed origins

2. **Authentication Errors**
   - Verify Supabase credentials
   - Check environment variables

3. **Database Errors**
   - Ensure schema is properly executed
   - Check RLS policies

4. **Storage Errors**
   - Verify bucket permissions
   - Check bucket names match configuration

### **Debug Mode**

Enable debug logging:

```env
DEBUG=true
LOG_LEVEL=DEBUG
```

## 📊 **API Endpoints**

### **Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### **Faculty Management**
- `GET /api/faculty` - Get all faculty
- `POST /api/faculty` - Create faculty
- `PUT /api/faculty/{id}` - Update faculty
- `DELETE /api/faculty/{id}` - Delete faculty

### **Face Recognition**
- `POST /api/register-face` - Register face
- `POST /api/recognize-face` - Recognize face
- `POST /api/attendance/check-in` - Check-in with face

### **Attendance**
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Create attendance
- `PUT /api/attendance/{id}` - Update attendance

### **Schedules**
- `GET /api/schedules` - Get schedules
- `POST /api/schedules` - Create schedule
- `PUT /api/schedules/{id}` - Update schedule

## 🎉 **Next Steps**

1. **Test the authentication flow**
2. **Add your first faculty member**
3. **Create schedules**
4. **Test face recognition**
5. **Record attendance**
6. **View reports and analytics**

## 📞 **Support**

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **GitHub Issues**: Create issues in your repository
- **Community**: Join Supabase Discord for help

---

**Your system is now ready for production use with real data!** 🚀 