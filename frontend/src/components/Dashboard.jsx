import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import {
  mockFaculty,
  mockSchedules,
  getTodayAttendance,
  getRecentAttendance,
  getDepartmentStats
} from '../utils/mockData';

function Dashboard() {
  const [stats, setStats] = useState({
    totalFaculty: 0,
    totalSchedules: 0,
    todayPresent: 0,
    todayAbsent: 0,
    attendanceRate: 0,
  });
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [departmentStats, setDepartmentStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState({
    faceRecognition: 'online',
    attendanceMonitoring: 'active',
    database: 'connected',
    cameraFeeds: 'live'
  });

  useEffect(() => {
    fetchDashboardData();
    // Simulate real-time updates
    const interval = setInterval(() => {
      updateSystemStatus();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const todayStats = getTodayAttendance();
      const deptStats = getDepartmentStats();
      const recent = getRecentAttendance(10);

      setStats({
        totalFaculty: mockFaculty.length,
        totalSchedules: mockSchedules.length,
        todayPresent: todayStats.present,
        todayAbsent: todayStats.absent,
        attendanceRate: parseFloat(todayStats.rate),
      });

      setRecentAttendance(recent);
      setDepartmentStats(deptStats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSystemStatus = () => {
    // Simulate system status changes
    const statuses = ['online', 'active', 'connected', 'live'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    setSystemStatus(prev => ({
      ...prev,
      faceRecognition: Math.random() > 0.1 ? 'online' : 'warning',
      cameraFeeds: Math.random() > 0.05 ? 'live' : 'warning'
    }));
  };

  const StatCard = ({ title, value, icon, color, subtitle, trend, loading: cardLoading }) => (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px -8px rgba(0,0,0,0.15)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Avatar 
            sx={{ 
              bgcolor: `${color}.light`, 
              color: color,
              width: 56,
              height: 56,
            }}
          >
            {icon}
          </Avatar>
          {trend && (
            <Chip 
              label={trend} 
              color="success" 
              size="small"
              icon={<TrendingUpIcon />}
            />
          )}
        </Box>
        
        {cardLoading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Loading...
            </Typography>
          </Box>
        ) : (
          <Typography variant="h3" component="div" sx={{ color, fontWeight: 700, mb: 1 }}>
            {value}
          </Typography>
        )}
        
        <Typography variant="h6" component="div" sx={{ color: 'text.primary', fontWeight: 600, mb: 0.5 }}>
          {title}
        </Typography>
        
        {subtitle && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  const SystemStatusCard = ({ title, status, description, icon, color }) => (
    <ListItem sx={{ 
      borderRadius: 2, 
      mb: 1,
      bgcolor: 'background.paper',
      border: '1px solid #e2e8f0',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Avatar 
          sx={{ 
            bgcolor: `${color}.light`, 
            color: color,
            mr: 2,
            width: 40,
            height: 40,
          }}
        >
          {icon}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {description}
          </Typography>
        </Box>
        <Chip 
          label={status} 
          color={status === 'online' || status === 'active' || status === 'connected' || status === 'live' ? 'success' : 'warning'} 
          size="small"
          sx={{ fontWeight: 500 }}
        />
      </Box>
    </ListItem>
  );

  const DepartmentCard = ({ department, stats }) => (
    <Card sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {department}
          </Typography>
          <Chip 
            label={`${stats.averageRate}%`} 
            color={stats.averageRate > 90 ? 'success' : stats.averageRate > 80 ? 'warning' : 'error'}
            size="small"
          />
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
          {stats.totalFaculty} faculty • {stats.presentCount}/{stats.totalAttendance} present
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={parseFloat(stats.averageRate)} 
          sx={{ 
            height: 6, 
            borderRadius: 3,
            bgcolor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
            }
          }}
        />
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
            Faculty Attendance Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Real-time monitoring of college faculty attendance and performance
          </Typography>
        </Box>
        
        <Tooltip title="Refresh Data">
          <IconButton 
            onClick={fetchDashboardData}
            sx={{ 
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {loading && (
        <Box sx={{ width: '100%', mb: 3 }}>
          <LinearProgress />
        </Box>
      )}

      {/* Today's Summary Alert */}
      <Alert 
        severity={stats.attendanceRate > 90 ? 'success' : stats.attendanceRate > 80 ? 'info' : 'warning'}
        sx={{ mb: 3 }}
        icon={stats.attendanceRate > 90 ? <CheckCircleIcon /> : <InfoIcon />}
      >
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          Today's Attendance Summary: {stats.todayPresent} present, {stats.todayAbsent} absent 
          ({stats.attendanceRate}% attendance rate)
        </Typography>
      </Alert>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Faculty"
            value={stats.totalFaculty}
            icon={<PeopleIcon />}
            color="primary"
            subtitle="Registered members"
            trend="+2 this semester"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Schedules"
            value={stats.totalSchedules}
            icon={<ScheduleIcon />}
            color="info"
            subtitle="Current timetables"
            trend="+3 this week"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Present Today"
            value={stats.todayPresent}
            icon={<CheckCircleIcon />}
            color="success"
            subtitle="Faculty present"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Absent Today"
            value={stats.todayAbsent}
            icon={<CancelIcon />}
            color="error"
            subtitle="Faculty absent"
            loading={loading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Recent Attendance Records
                </Typography>
                <Chip 
                  label={`${stats.attendanceRate}% Rate`} 
                  color={stats.attendanceRate > 90 ? 'success' : stats.attendanceRate > 80 ? 'warning' : 'error'}
                  size="small"
                />
              </Box>
              
              <List sx={{ p: 0 }}>
                {recentAttendance.map((record, index) => (
                  <ListItem 
                    key={index} 
                    sx={{ 
                      borderRadius: 2, 
                      mb: 1,
                      bgcolor: 'background.default',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: record.status === 'present' ? 'success.light' : 'error.light',
                          color: record.status === 'present' ? 'success.main' : 'error.main',
                          mr: 2,
                          width: 40,
                          height: 40,
                        }}
                      >
                        {record.status === 'present' ? <CheckCircleIcon /> : <CancelIcon />}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {record.facultyName} - {record.subject}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {record.classroom} • {new Date(record.timestamp).toLocaleString()}
                          {record.confidence && ` • ${record.confidence}% confidence`}
                        </Typography>
                      </Box>
                      <Chip
                        label={record.status}
                        color={record.status === 'present' ? 'success' : 'error'}
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>
                  </ListItem>
                ))}
              </List>
              
              {recentAttendance.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    No recent attendance records
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 3 }}>
                System Status
              </Typography>
              
              <List sx={{ p: 0, mb: 3 }}>
                <SystemStatusCard
                  title="Face Recognition"
                  status={systemStatus.faceRecognition}
                  description="AI model active and ready"
                  icon={<VisibilityIcon />}
                  color="success"
                />
                <SystemStatusCard
                  title="Attendance Monitoring"
                  status={systemStatus.attendanceMonitoring}
                  description="Real-time tracking enabled"
                  icon={<ScheduleIcon />}
                  color="info"
                />
                <SystemStatusCard
                  title="Database"
                  status={systemStatus.database}
                  description="MongoDB connection stable"
                  icon={<SchoolIcon />}
                  color="primary"
                />
                <SystemStatusCard
                  title="Camera Feeds"
                  status={systemStatus.cameraFeeds}
                  description="8 classrooms monitored"
                  icon={<VisibilityIcon />}
                  color="warning"
                />
              </List>

              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
                Department Performance
              </Typography>
              
              {Object.entries(departmentStats).map(([dept, stats]) => (
                <DepartmentCard key={dept} department={dept} stats={stats} />
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 