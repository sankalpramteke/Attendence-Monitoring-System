import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  useTheme,
} from '@mui/material';
import {
  School as SchoolIcon,
  Face as FaceIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
  Cloud as CloudIcon,
} from '@mui/icons-material';

function About() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const technologies = [
    { name: 'React.js', description: 'Modern frontend framework for responsive UI', icon: <CodeIcon /> },
    { name: 'Material-UI', description: 'Professional design system and components', icon: <CodeIcon /> },
    { name: 'Face Recognition AI', description: 'Advanced facial recognition algorithms', icon: <FaceIcon /> },
    { name: 'Real-time Analytics', description: 'Live data processing and visualization', icon: <AnalyticsIcon /> },
    { name: 'Secure Database', description: 'Encrypted data storage and backup', icon: <StorageIcon /> },
    { name: 'Cloud Infrastructure', description: 'Scalable cloud-based deployment', icon: <CloudIcon /> },
  ];

  const features = [
    {
      title: 'AI-Powered Face Recognition',
      description: 'Advanced facial recognition technology that accurately identifies faculty members using deep learning algorithms. The system can work in various lighting conditions and handle multiple faces simultaneously.',
      icon: <FaceIcon />,
      color: 'primary'
    },
    {
      title: 'Real-time Monitoring',
      description: 'Live attendance tracking with instant notifications and updates. Monitor faculty presence across multiple classrooms simultaneously with minimal latency.',
      icon: <TrendingUpIcon />,
      color: 'success'
    },
    {
      title: 'Comprehensive Analytics',
      description: 'Detailed reports and analytics including attendance trends, department performance, and individual faculty statistics. Export data in various formats for further analysis.',
      icon: <AnalyticsIcon />,
      color: 'info'
    },
    {
      title: 'Schedule Management',
      description: 'Advanced schedule management with conflict detection, classroom allocation, and automated attendance tracking based on scheduled classes.',
      icon: <ScheduleIcon />,
      color: 'warning'
    },
    {
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with encrypted data transmission, secure authentication, and regular backups to ensure data integrity and privacy.',
      icon: <SecurityIcon />,
      color: 'error'
    },
    {
      title: 'High Performance',
      description: 'Optimized for high-performance with fast response times, efficient data processing, and scalable architecture to handle large faculty populations.',
      icon: <SpeedIcon />,
      color: 'secondary'
    }
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
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Avatar sx={{ 
          bgcolor: 'primary.main', 
          width: 80, 
          height: 80, 
          mx: 'auto', 
          mb: 3 
        }}>
          <SchoolIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          About Our System
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3 }}>
          Advanced Faculty Attendance Monitoring for Modern Colleges
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 800, mx: 'auto', color: 'text.secondary' }}>
          Our Faculty Attendance Monitoring System represents the cutting edge of educational technology, 
          combining artificial intelligence, real-time analytics, and secure data management to revolutionize 
          how colleges track and manage faculty attendance.
        </Typography>
      </Box>

      {/* Mission Section */}
      <Card sx={{ borderRadius: 3, mb: 6 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
            Our Mission
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, textAlign: 'center' }}>
            To provide colleges and universities with a comprehensive, AI-powered solution that streamlines 
            faculty attendance monitoring while ensuring accuracy, transparency, and efficiency. We believe 
            that modern educational institutions deserve modern tools that enhance productivity and accountability.
          </Typography>
        </CardContent>
      </Card>

      {/* Features Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, textAlign: 'center', mb: 4 }}>
          Key Features & Capabilities
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

      {/* Technology Stack */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, textAlign: 'center', mb: 4 }}>
          Technology Stack
        </Typography>
        <Grid container spacing={3}>
          {technologies.map((tech, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ 
                borderRadius: 3,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-2px)' }
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar sx={{ 
                    bgcolor: 'primary.light', 
                    color: 'primary.main',
                    width: 56,
                    height: 56,
                    mx: 'auto',
                    mb: 2
                  }}>
                    {tech.icon}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {tech.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tech.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Benefits Section */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                Benefits for Colleges
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
                System Architecture
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Frontend
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Modern React.js application with Material-UI components for a professional, responsive interface.
                </Typography>
                <Chip label="React.js" color="primary" size="small" sx={{ mr: 1 }} />
                <Chip label="Material-UI" color="secondary" size="small" />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  AI Engine
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Advanced facial recognition powered by deep learning algorithms for accurate identification.
                </Typography>
                <Chip label="Face Recognition" color="info" size="small" sx={{ mr: 1 }} />
                <Chip label="Deep Learning" color="warning" size="small" />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Data Management
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Secure data storage with encryption and real-time synchronization across all components.
                </Typography>
                <Chip label="Encrypted Storage" color="success" size="small" sx={{ mr: 1 }} />
                <Chip label="Real-time Sync" color="error" size="small" />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Analytics
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Comprehensive analytics engine providing insights and detailed reporting capabilities.
                </Typography>
                <Chip label="Advanced Analytics" color="secondary" size="small" sx={{ mr: 1 }} />
                <Chip label="Real-time Reports" color="primary" size="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Statistics Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, textAlign: 'center', mb: 4 }}>
          System Statistics
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
              <PeopleIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                8
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Faculty Members
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
              <ScheduleIcon sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                8
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Active Schedules
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
              <AssessmentIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                92%
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Attendance Rate
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
              <SchoolIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                8
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Departments
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Contact/Info Section */}
      <Card sx={{ 
        borderRadius: 3, 
        bgcolor: isDark ? 'primary.dark' : 'primary.light',
        color: isDark ? 'white' : 'primary.contrastText'
      }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Ready to Transform Your Faculty Attendance?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            Join the future of educational technology with our advanced AI-powered attendance monitoring system.
          </Typography>
          <Chip 
            label="College Project" 
            color="secondary" 
            size="large"
            sx={{ fontWeight: 600 }}
          />
        </CardContent>
      </Card>
    </Box>
  );
}

export default About; 