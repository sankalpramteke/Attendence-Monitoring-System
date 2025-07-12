import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  IconButton,
  Tooltip,
  LinearProgress,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import {
  Camera as CameraIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  PhotoCamera as PhotoCameraIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import { mockFaculty } from '../utils/mockData';

const departments = [
  'Computer Science',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'History',
  'Economics',
  'Psychology',
  'Business Administration',
  'Art & Design',
  'Music',
];

const subjects = [
  'Programming Fundamentals',
  'Data Structures & Algorithms',
  'Database Systems',
  'Web Development',
  'Machine Learning',
  'Computer Networks',
  'Software Engineering',
  'Operating Systems',
  'Digital Electronics',
  'Control Systems',
  'Calculus & Linear Algebra',
  'Differential Equations',
  'Quantum Mechanics',
  'Thermodynamics',
  'Structural Analysis',
  'Organic Chemistry',
  'Inorganic Chemistry',
  'Cell Biology',
  'Genetics',
  'Literature',
  'Creative Writing',
  'World History',
  'Microeconomics',
  'Macroeconomics',
  'Cognitive Psychology',
  'Marketing',
  'Financial Management',
  'Digital Art',
  'Music Theory',
];

const steps = [
  'Basic Information',
  'Department & Subject',
  'Contact Details',
  'Face Registration',
  'Review & Submit'
];

function FacultyRegistration() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    faculty_id: '',
    department: '',
    subject: '',
    email: '',
    phone: '',
    office: '',
  });
  const [faceImage, setFaceImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [registeredFaculty, setRegisteredFaculty] = useState(mockFaculty);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleNext = () => {
    if (isStepValid(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData({
      name: '',
      faculty_id: '',
      department: '',
      subject: '',
      email: '',
      phone: '',
      office: '',
    });
    setFaceImage(null);
    setMessage({ type: '', text: '' });
  };

  const startCamera = async () => {
    try {
      setCameraLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setMessage({ type: 'error', text: 'Unable to access camera. Please check permissions.' });
    } finally {
      setCameraLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);

      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setFaceImage(imageData);
      stopCamera();
      handleNext();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!faceImage) {
      setMessage({ type: 'error', text: 'Please capture a face image' });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newFaculty = {
        id: formData.faculty_id,
        name: formData.name,
        department: formData.department,
        subject: formData.subject,
        email: formData.email,
        phone: formData.phone,
        office: formData.office,
        faceImage: faceImage,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        attendanceRate: 0
      };

      setRegisteredFaculty(prev => [...prev, newFaculty]);
      setMessage({ type: 'success', text: 'Faculty registered successfully!' });
      handleReset();
    } catch (error) {
      console.error('Error registering faculty:', error);
      setMessage({ 
        type: 'error', 
        text: 'Error registering faculty. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const isStepValid = (step) => {
    switch (step) {
      case 0:
        return formData.name && formData.faculty_id;
      case 1:
        return formData.department && formData.subject;
      case 2:
        return formData.email && formData.phone && formData.office;
      case 3:
        return faceImage;
      default:
        return true;
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={handleInputChange('name')}
                required
                placeholder="Dr. John Smith"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Faculty ID"
                value={formData.faculty_id}
                onChange={handleInputChange('faculty_id')}
                required
                placeholder="FAC001"
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Department</InputLabel>
                <Select
                  value={formData.department}
                  onChange={handleInputChange('department')}
                  label="Department"
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Primary Subject</InputLabel>
                <Select
                  value={formData.subject}
                  onChange={handleInputChange('subject')}
                  label="Primary Subject"
                >
                  {subjects.map((subject) => (
                    <MenuItem key={subject} value={subject}>
                      {subject}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                required
                placeholder="faculty@college.edu"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                required
                placeholder="+1-555-0100"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Office Location"
                value={formData.office}
                onChange={handleInputChange('office')}
                required
                placeholder="Room 301, CS Building"
              />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              Please capture a clear photo of the faculty member for face recognition system.
            </Typography>
            
            {!showCamera && !faceImage && (
              <Button
                variant="contained"
                startIcon={<CameraIcon />}
                onClick={startCamera}
                disabled={cameraLoading}
                sx={{ mb: 2 }}
              >
                {cameraLoading ? 'Starting Camera...' : 'Start Camera'}
              </Button>
            )}

            {showCamera && (
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <video
                  ref={videoRef}
                  autoPlay
                  style={{ width: '100%', maxWidth: 400, borderRadius: 8 }}
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={captureImage}
                    startIcon={<PhotoCameraIcon />}
                  >
                    Capture Photo
                  </Button>
                </Box>
              </Box>
            )}

            {faceImage && (
              <Box sx={{ textAlign: 'center' }}>
                <img
                  src={faceImage}
                  alt="Captured face"
                  style={{ width: '100%', maxWidth: 400, borderRadius: 8 }}
                />
                <Typography variant="body2" sx={{ mt: 1, color: 'success.main' }}>
                  ✓ Photo captured successfully
                </Typography>
              </Box>
            )}
          </Box>
        );
      case 4:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Review Registration Details
            </Typography>
            
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Name
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {formData.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Faculty ID
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {formData.faculty_id}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Department
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {formData.department}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Subject
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {formData.subject}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {formData.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {formData.phone}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Office Location
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {formData.office}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {faceImage && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Face Image Captured
                </Typography>
                <img
                  src={faceImage}
                  alt="Face registration"
                  style={{ width: 100, height: 100, borderRadius: 8, objectFit: 'cover' }}
                />
              </Box>
            )}
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 48, height: 48 }}>
          <PersonIcon />
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
            Faculty Registration
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Register new faculty members for attendance monitoring
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              {message.text && (
                <Alert severity={message.type} sx={{ mb: 3 }}>
                  {message.text}
                </Alert>
              )}

              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      StepIconComponent={({ active, completed }) => (
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: completed ? 'success.main' : active ? 'primary.main' : 'grey.300',
                            color: 'white',
                            fontSize: '0.875rem',
                          }}
                        >
                          {completed ? <CheckCircleIcon /> : index + 1}
                        </Avatar>
                      )}
                    >
                      {label}
                    </StepLabel>
                    <StepContent>
                      <Box sx={{ mt: 2, mb: 2 }}>
                        {getStepContent(index)}
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <div>
                          <Button
                            variant="contained"
                            onClick={index === steps.length - 1 ? handleSubmit : handleNext}
                            disabled={!isStepValid(index) || loading}
                            sx={{ mr: 1 }}
                          >
                            {index === steps.length - 1 ? 'Submit Registration' : 'Continue'}
                          </Button>
                          <Button
                            disabled={index === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                          >
                            Back
                          </Button>
                        </div>
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>

              {loading && (
                <Box sx={{ mt: 3 }}>
                  <LinearProgress />
                  <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                    Registering faculty member...
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Registered Faculty
              </Typography>
              
              <List sx={{ p: 0 }}>
                {registeredFaculty.slice(0, 5).map((faculty) => (
                  <ListItem key={faculty.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={faculty.name}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {faculty.department}
                          </Typography>
                          <Chip 
                            label={`${faculty.attendanceRate}% attendance`}
                            size="small"
                            color={faculty.attendanceRate > 90 ? 'success' : faculty.attendanceRate > 80 ? 'warning' : 'error'}
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
              
              {registeredFaculty.length > 5 && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    +{registeredFaculty.length - 5} more faculty members
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default FacultyRegistration; 