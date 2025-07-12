import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
} from '@mui/material';
import {
  School as SchoolIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Analytics as AnalyticsIcon,
  Face as FaceIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authService';

function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <FaceIcon />,
      title: 'AI-Powered Face Recognition',
      description: 'Advanced facial recognition technology for accurate faculty identification and attendance tracking.',
      color: 'primary'
    },
    {
      icon: <AnalyticsIcon />,
      title: 'Real-time Analytics',
      description: 'Comprehensive dashboards with live attendance data, trends, and performance metrics.',
      color: 'info'
    },
    {
      icon: <SecurityIcon />,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with encrypted data storage and secure authentication.',
      color: 'success'
    },
    {
      icon: <SpeedIcon />,
      title: 'High Performance',
      description: 'Fast and responsive system designed to handle multiple faculty members simultaneously.',
      color: 'warning'
    }
  ];

  const stats = [
    { label: 'Faculty Members', value: '8', icon: <PeopleIcon />, color: 'primary' },
    { label: 'Active Schedules', value: '8', icon: <ScheduleIcon />, color: 'info' },
    { label: 'Attendance Rate', value: '92%', icon: <TrendingUpIcon />, color: 'success' },
    { label: 'Departments', value: '8', icon: <SchoolIcon />, color: 'secondary' }
  ];

  const benefits = [
    'Automated attendance tracking reduces manual work by 90%',
    'Real-time monitoring improves accountability and transparency',
    'AI-powered recognition ensures accuracy and eliminates fraud',
    'Comprehensive reporting enables data-driven decision making',
    'Schedule conflict detection prevents scheduling issues',
    'Mobile-responsive design works on all devices',
    'Secure data storage protects sensitive information',
    'Easy integration with existing college systems'
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ 
        textAlign: 'center', 
        py: 8, 
        px: 3,
        background: isDark 
          ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 3,
        mb: 6,
        color: 'white'
      }}>
        <Avatar sx={{ 
          bgcolor: 'rgba(255,255,255,0.2)', 
          width: 80, 
          height: 80, 
          mx: 'auto', 
          mb: 3 
        }}>
          <SchoolIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
          Faculty Attendance Monitoring System
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
          AI-Powered Attendance Tracking for College Faculty
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto', opacity: 0.8 }}>
          Streamline faculty attendance monitoring with advanced face recognition technology. 
          Track attendance in real-time, generate comprehensive reports, and manage schedules efficiently.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          {isAuthenticated ? (
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/dashboard')}
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.main',
                '&:hover': { bgcolor: 'grey.100' }
              }}
            >
              View Dashboard
            </Button>
          ) : (
            <>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate('/login')}
                sx={{ 
                  bgcolor: 'white', 
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'grey.100' }
                }}
              >
                Sign In
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                onClick={() => navigate('/register')}
                sx={{ 
                  borderColor: 'white', 
                  color: 'white',
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                Register
              </Button>
            </>
          )}
          <Button 
            variant="outlined" 
            size="large"
            onClick={() => navigate('/about')}
            sx={{ 
              borderColor: 'white', 
              color: 'white',
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Learn More
          </Button>
        </Box>
      </Box>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ 
              textAlign: 'center', 
              borderRadius: 3,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent sx={{ py: 3 }}>
                <Avatar sx={{ 
                  bgcolor: `${stat.color}.light`, 
                  color: stat.color,
                  width: 56,
                  height: 56,
                  mx: 'auto',
                  mb: 2
                }}>
                  {stat.icon}
                </Avatar>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Features Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, textAlign: 'center', mb: 4 }}>
          Key Features
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ 
                height: '100%', 
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: isDark 
                    ? '0 8px 25px -8px rgba(0,0,0,0.5)' 
                    : '0 8px 25px -8px rgba(0,0,0,0.15)',
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ 
                      bgcolor: `${feature.color}.light`, 
                      color: feature.color,
                      mr: 2,
                      width: 48,
                      height: 48
                    }}>
                      {feature.icon}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Benefits Section */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                Why Choose Our System?
              </Typography>
              <List>
                {benefits.map((benefit, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={benefit}
                      primaryTypographyProps={{ variant: 'body1' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                System Overview
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Real-time overview of faculty attendance, department performance, and system status.
                </Typography>
                <Chip label="Live Monitoring" color="success" size="small" />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Faculty Registration
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Easy registration process with face capture for AI recognition system.
                </Typography>
                <Chip label="Face Recognition" color="info" size="small" />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Schedule Management
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Manage class schedules with conflict detection and classroom allocation.
                </Typography>
                <Chip label="Conflict Detection" color="warning" size="small" />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Attendance Reports
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Comprehensive reports with filtering, analytics, and export capabilities.
                </Typography>
                <Chip label="Advanced Analytics" color="secondary" size="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* CTA Section */}
      <Box sx={{ 
        textAlign: 'center', 
        mt: 6, 
        p: 4, 
        bgcolor: 'primary.light', 
        borderRadius: 3 
      }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Ready to Get Started?
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, opacity: 0.8 }}>
          Experience the future of faculty attendance monitoring with our advanced AI-powered system.
        </Typography>
        {isAuthenticated ? (
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/dashboard')}
            sx={{ 
              bgcolor: 'white', 
              color: 'primary.main',
              '&:hover': { bgcolor: 'grey.100' }
            }}
          >
            Access Dashboard
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/login')}
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.main',
                '&:hover': { bgcolor: 'grey.100' }
              }}
            >
              Sign In
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => navigate('/register')}
              sx={{ 
                borderColor: 'white', 
                color: 'primary.main',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Register
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Home; 