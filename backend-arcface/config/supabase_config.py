import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv('SUPABASE_URL', 'your_supabase_project_url')
SUPABASE_SERVICE_ROLE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY', 'your_supabase_service_role_key')
SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY', 'your_supabase_anon_key')

# Initialize Supabase client with service role key for admin operations
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# Initialize Supabase client with anon key for user authentication
supabase_auth: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# Database table names
TABLES = {
    'USERS': 'users',
    'FACULTY': 'faculty',
    'ATTENDANCE': 'attendance',
    'SCHEDULES': 'schedules',
    'FACE_EMBEDDINGS': 'face_embeddings',
    'FACE_IMAGES': 'face_images'
}

# Storage bucket names
STORAGE_BUCKETS = {
    'FACE_IMAGES': 'face-images',
    'PROFILE_PICTURES': 'profile-pictures'
} 