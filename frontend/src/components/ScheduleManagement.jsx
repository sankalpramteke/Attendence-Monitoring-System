import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { mockFaculty, mockSchedules } from '../utils/mockData';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
];

const classrooms = [
  'CS-101', 'CS-102', 'CS-201', 'CS-202', 'CS-301', 'CS-302',
  'EE-101', 'EE-201', 'EE-301', 'EE-401',
  'ME-101', 'ME-201', 'ME-301', 'ME-401',
  'CE-101', 'CE-201', 'CE-301', 'CE-401',
  'MATH-101', 'MATH-201', 'MATH-301',
  'PHYS-101', 'PHYS-201', 'PHYS-301',
  'CHEM-101', 'CHEM-201', 'CHEM-301',
  'LECTURE-HALL-A', 'LECTURE-HALL-B', 'LECTURE-HALL-C',
  'LAB-101', 'LAB-201', 'LAB-301'
];

function ScheduleManagement() {
  const [formData, setFormData] = useState({
    faculty_id: '',
    classroom: '',
    start_time: '',
    end_time: '',
    subject: '',
    day: '',
    capacity: 30,
  });
  const [faculty, setFaculty] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [conflicts, setConflicts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFaculty(mockFaculty);
      setSchedules(mockSchedules);
      detectConflicts(mockSchedules);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const detectConflicts = (scheduleList) => {
    const conflicts = [];
    
    for (let i = 0; i < scheduleList.length; i++) {
      for (let j = i + 1; j < scheduleList.length; j++) {
        const schedule1 = scheduleList[i];
        const schedule2 = scheduleList[j];
        
        // Check for classroom conflicts
        if (schedule1.classroom === schedule2.classroom && 
            schedule1.day === schedule2.day) {
          const start1 = new Date(`2000-01-01 ${schedule1.startTime}`);
          const end1 = new Date(`2000-01-01 ${schedule1.endTime}`);
          const start2 = new Date(`2000-01-01 ${schedule2.startTime}`);
          const end2 = new Date(`2000-01-01 ${schedule2.endTime}`);
          
          if (start1 < end2 && start2 < end1) {
            conflicts.push({
              type: 'classroom',
              schedule1,
              schedule2,
              message: `Classroom conflict: ${schedule1.subject} and ${schedule2.subject}`
            });
          }
        }
        
        // Check for faculty conflicts
        if (schedule1.facultyId === schedule2.facultyId && 
            schedule1.day === schedule2.day) {
          const start1 = new Date(`2000-01-01 ${schedule1.startTime}`);
          const end1 = new Date(`2000-01-01 ${schedule1.endTime}`);
          const start2 = new Date(`2000-01-01 ${schedule2.startTime}`);
          const end2 = new Date(`2000-01-01 ${schedule2.endTime}`);
          
          if (start1 < end2 && start2 < end1) {
            conflicts.push({
              type: 'faculty',
              schedule1,
              schedule2,
              message: `Faculty conflict: ${schedule1.subject} and ${schedule2.subject}`
            });
          }
        }
      }
    }
    
    setConflicts(conflicts);
  };

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!formData.faculty_id || !formData.classroom || !formData.subject || 
        !formData.start_time || !formData.end_time || !formData.day) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newSchedule = {
        id: `SCH${Date.now()}`,
        facultyId: formData.faculty_id,
        subject: formData.subject,
        classroom: formData.classroom,
        day: formData.day,
        startTime: formData.start_time,
        endTime: formData.end_time,
        capacity: formData.capacity,
        status: 'active'
      };

      const updatedSchedules = [...schedules, newSchedule];
      setSchedules(updatedSchedules);
      detectConflicts(updatedSchedules);
      
      setMessage({ type: 'success', text: 'Schedule added successfully!' });
      setFormData({
        faculty_id: '',
        classroom: '',
        start_time: '',
        end_time: '',
        subject: '',
        day: '',
        capacity: 30,
      });
    } catch (error) {
      console.error('Error adding schedule:', error);
      setMessage({ 
        type: 'error', 
        text: 'Error adding schedule. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchedule = (scheduleId) => {
    const updatedSchedules = schedules.filter(s => s.id !== scheduleId);
    setSchedules(updatedSchedules);
    detectConflicts(updatedSchedules);
    setMessage({ type: 'success', text: 'Schedule deleted successfully!' });
  };

  const getFacultyName = (facultyId) => {
    const facultyMember = faculty.find(f => f.id === facultyId);
    return facultyMember ? facultyMember.name : 'Unknown';
  };

  const getFacultyDepartment = (facultyId) => {
    const facultyMember = faculty.find(f => f.id === facultyId);
    return facultyMember ? facultyMember.department : 'Unknown';
  };

  const ScheduleCard = ({ schedule }) => (
    <Card sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', mr: 2 }}>
              <ScheduleIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {schedule.subject}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {getFacultyName(schedule.facultyId)} • {schedule.classroom}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip 
              label={schedule.day} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
            <Tooltip title="Delete Schedule">
              <IconButton 
                size="small" 
                color="error"
                onClick={() => handleDeleteSchedule(schedule.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TimeIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Time
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {schedule.startTime} - {schedule.endTime}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Capacity
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {schedule.capacity} students
            </Typography>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Chip 
            label={getFacultyDepartment(schedule.facultyId)}
            size="small"
            variant="outlined"
            color="secondary"
          />
          <Chip 
            label={schedule.status}
            size="small"
            color={schedule.status === 'active' ? 'success' : 'warning'}
          />
        </Box>
      </CardContent>
    </Card>
  );

  const ConflictCard = ({ conflict }) => (
    <Card sx={{ mb: 2, borderRadius: 2, border: '1px solid #f59e0b' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main', mr: 2 }}>
            <WarningIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.main' }}>
              Schedule Conflict
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {conflict.message}
            </Typography>
          </Box>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">
              {conflict.schedule1.subject}
            </Typography>
            <Typography variant="body2">
              {conflict.schedule1.classroom} • {conflict.schedule1.startTime}-{conflict.schedule1.endTime}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">
              {conflict.schedule2.subject}
            </Typography>
            <Typography variant="body2">
              {conflict.schedule2.classroom} • {conflict.schedule2.startTime}-{conflict.schedule2.endTime}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar sx={{ bgcolor: 'info.main', mr: 2, width: 48, height: 48 }}>
          <ScheduleIcon />
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
            Schedule Management
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Manage faculty lecture schedules and classroom assignments
          </Typography>
        </Box>
      </Box>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }}>{message.text}</Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Add New Schedule
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {loading && (
                <Box sx={{ mb: 2 }}>
                  <LinearProgress />
                </Box>
              )}
              
              <Box component="form" onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Faculty</InputLabel>
                  <Select
                    value={formData.faculty_id}
                    onChange={handleInputChange('faculty_id')}
                    label="Faculty"
                  >
                    {faculty.map((f) => (
                      <MenuItem key={f.id} value={f.id}>
                        {f.name} ({f.department})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Classroom</InputLabel>
                  <Select
                    value={formData.classroom}
                    onChange={handleInputChange('classroom')}
                    label="Classroom"
                  >
                    {classrooms.map((room) => (
                      <MenuItem key={room} value={room}>
                        {room}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  label="Subject"
                  value={formData.subject}
                  onChange={handleInputChange('subject')}
                  margin="normal"
                  required
                  placeholder="e.g., Data Structures & Algorithms"
                />
                
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Day</InputLabel>
                  <Select
                    value={formData.day}
                    onChange={handleInputChange('day')}
                    label="Day"
                  >
                    {days.map((day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Start Time</InputLabel>
                      <Select
                        value={formData.start_time}
                        onChange={handleInputChange('start_time')}
                        label="Start Time"
                      >
                        {timeSlots.map((time) => (
                          <MenuItem key={time} value={time}>
                            {time}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth required>
                      <InputLabel>End Time</InputLabel>
                      <Select
                        value={formData.end_time}
                        onChange={handleInputChange('end_time')}
                        label="End Time"
                      >
                        {timeSlots.map((time) => (
                          <MenuItem key={time} value={time}>
                            {time}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                
                <TextField
                  fullWidth
                  label="Capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleInputChange('capacity')}
                  margin="normal"
                  required
                  inputProps={{ min: 1, max: 200 }}
                />
                
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  startIcon={<AddIcon />}
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? 'Adding Schedule...' : 'Add Schedule'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Current Schedules
                    </Typography>
                    <Chip 
                      label={`${schedules.length} schedules`} 
                      color="primary" 
                      size="small"
                    />
                  </Box>
                  
                  {schedules.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        No schedules found. Add a new schedule to get started.
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      {schedules.map((schedule) => (
                        <ScheduleCard key={schedule.id} schedule={schedule} />
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {conflicts.length > 0 && (
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 3, border: '1px solid #f59e0b' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <WarningIcon sx={{ color: 'warning.main', mr: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.main' }}>
                        Schedule Conflicts ({conflicts.length})
                      </Typography>
                    </Box>
                    
                    {conflicts.map((conflict, index) => (
                      <ConflictCard key={index} conflict={conflict} />
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ScheduleManagement; 