# Supabase Integration Setup Guide

This guide will help you set up Supabase for authentication and image storage in your Attendance Monitoring System.

## Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Supabase account

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `attendance-monitoring-system`
   - Database Password: Choose a strong password
   - Region: Select closest to your users
5. Click "Create new project"
6. Wait for the project to be set up (usually 2-3 minutes)

## Step 2: Get Project Credentials

1. In your Supabase dashboard, go to Settings → API
2. Copy the following values:
   - Project URL
   - Anon (public) key
   - Service Role key (keep this secret!)

## Step 3: Set Up Database Schema

1. In your Supabase dashboard, go to SQL Editor
2. Copy and paste the contents of `database_schema.sql`
3. Click "Run" to execute the schema

## Step 4: Create Storage Buckets

1. Go to Storage in your Supabase dashboard
2. Create two buckets:
   - `face-images` (for face recognition images)
   - `profile-pictures` (for user profile pictures)
3. Set both buckets to public (for easy access)

## Step 5: Configure Environment Variables

### Frontend Configuration

Create a `.env` file in the `frontend/` directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:8000
```

### Backend Configuration

Create a `.env` file in the `backend-arcface/` directory:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_supabase_database_url
```

## Step 6: Install Dependencies

### Frontend Dependencies

```bash
cd frontend
npm install
```

### Backend Dependencies

```bash
cd backend-arcface
pip install -r requirements.txt
```

## Step 7: Download YOLOv8 Face Detection Model

```bash
cd backend-arcface
wget https://github.com/derronqi/yolov8-face/releases/download/v0.0.0/yolov8n-face.pt
```

Or download manually from: https://github.com/derronqi/yolov8-face/releases

## Step 8: Start the Application

### Start Backend

```bash
cd backend-arcface
python main.py
```

The backend will start on `http://localhost:8000`

### Start Frontend

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

## Step 9: Create Initial Admin User

1. Go to your Supabase dashboard → Authentication → Users
2. Click "Add user"
3. Enter admin details:
   - Email: `admin@college.edu`
   - Password: `admin123`
4. Go to SQL Editor and run:

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

## Step 10: Test the Integration

1. Open `http://localhost:5173` in your browser
2. Login with the admin credentials
3. Try registering a faculty member with face capture
4. Test face recognition for attendance

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **Service Role Key**: Keep the service role key secret and only use it in backend
3. **Row Level Security**: The database schema includes RLS policies for data protection
4. **CORS**: Configure CORS properly for production deployment

## Production Deployment

### Frontend Deployment

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy to your preferred hosting service (Netlify, Vercel, etc.)

### Backend Deployment

1. Deploy to a cloud service (Heroku, Railway, DigitalOcean, etc.)
2. Update environment variables in your hosting platform
3. Update CORS origins in `main.py` to include your production frontend URL

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure CORS is properly configured in `main.py`
2. **Authentication Errors**: Verify your Supabase credentials
3. **Face Detection Issues**: Ensure YOLOv8 model is downloaded
4. **Storage Upload Errors**: Check bucket permissions and policies

### Debug Mode

Enable debug logging by setting environment variables:

```env
DEBUG=true
LOG_LEVEL=DEBUG
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Face Recognition
- `POST /api/register-face` - Register new face
- `POST /api/recognize-face` - Recognize face
- `POST /api/attendance/check-in` - Check-in with face recognition

### Data Management
- `GET /api/faculty` - Get all faculty
- `GET /api/attendance/{faculty_id}` - Get attendance records
- `POST /api/schedules` - Create schedule
- `GET /api/schedules` - Get schedules

## Support

For issues related to:
- **Supabase**: Check [Supabase Documentation](https://supabase.com/docs)
- **Face Recognition**: Check InsightFace and YOLOv8 documentation
- **Frontend**: Check React and Material-UI documentation
- **Backend**: Check FastAPI documentation 