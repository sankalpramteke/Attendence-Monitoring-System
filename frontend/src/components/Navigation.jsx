import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  PersonAdd as PersonAddIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

const drawerWidth = 280;

const publicMenu = [
  { text: 'Home', icon: <HomeIcon />, path: '/', description: 'Welcome page' },
  { text: 'About', icon: <InfoIcon />, path: '/about', description: 'About this system' },
];

const adminMenu = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', description: 'System overview and analytics' },
  { text: 'Faculty Registration', icon: <PersonAddIcon />, path: '/faculty', description: 'Add new faculty members' },
  { text: 'Schedule Management', icon: <ScheduleIcon />, path: '/schedule', description: 'Manage lecture schedules' },
  { text: 'Attendance Reports', icon: <AssessmentIcon />, path: '/attendance', description: 'View attendance analytics' },
];

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
          boxShadow: isDark 
            ? '4px 0 8px -4px rgb(0 0 0 / 0.5)' 
            : '4px 0 8px -4px rgb(0 0 0 / 0.1)',
        },
      }}
    >
      <Box sx={{ 
        p: 3, 
        borderBottom: isDark ? '1px solid #334155' : '1px solid #e2e8f0', 
        bgcolor: 'background.paper' 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ 
            bgcolor: 'primary.main', 
            mr: 2, 
            width: 48, 
            height: 48 
          }}>
            <DashboardIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Admin Panel
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              System Control
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip 
            label="Live Monitoring" 
            color="success" 
            size="small" 
            sx={{ fontWeight: 500 }} 
          />
          <Chip 
            label="AI Active" 
            color="info" 
            size="small" 
            sx={{ fontWeight: 500 }} 
          />
        </Box>
      </Box>

      <Box sx={{ overflow: 'auto', flex: 1 }}>
        <List sx={{ py: 2 }}>
          {publicMenu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  selected={isActive}
                  onClick={() => navigate(item.path)}
                  sx={{
                    mx: 2,
                    borderRadius: 2,
                    py: 1.5,
                    px: 2,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' },
                      '& .MuiListItemIcon-root': { color: 'white' },
                    },
                    '&:hover': { 
                      bgcolor: isActive 
                        ? 'primary.dark' 
                        : isDark 
                          ? 'rgba(255,255,255,0.08)' 
                          : 'action.hover' 
                    },
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: 40, 
                    color: isActive ? 'white' : 'text.secondary' 
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <Box sx={{ flex: 1 }}>
                    <ListItemText
                      primary={item.text}
                      secondary={item.description}
                      primaryTypographyProps={{ 
                        fontWeight: isActive ? 600 : 500, 
                        fontSize: '0.875rem' 
                      }}
                      secondaryTypographyProps={{ 
                        fontSize: '0.75rem', 
                        color: isActive 
                          ? 'rgba(255,255,255,0.7)' 
                          : 'text.secondary' 
                      }}
                    />
                  </Box>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        
        <Divider sx={{ mx: 2, my: 2 }} />
        
        <List sx={{ py: 2 }}>
          {adminMenu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  selected={isActive}
                  onClick={() => navigate(item.path)}
                  sx={{
                    mx: 2,
                    borderRadius: 2,
                    py: 1.5,
                    px: 2,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' },
                      '& .MuiListItemIcon-root': { color: 'white' },
                    },
                    '&:hover': { 
                      bgcolor: isActive 
                        ? 'primary.dark' 
                        : isDark 
                          ? 'rgba(255,255,255,0.08)' 
                          : 'action.hover' 
                    },
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: 40, 
                    color: isActive ? 'white' : 'text.secondary' 
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <Box sx={{ flex: 1 }}>
                    <ListItemText
                      primary={item.text}
                      secondary={item.description}
                      primaryTypographyProps={{ 
                        fontWeight: isActive ? 600 : 500, 
                        fontSize: '0.875rem' 
                      }}
                      secondaryTypographyProps={{ 
                        fontSize: '0.75rem', 
                        color: isActive 
                          ? 'rgba(255,255,255,0.7)' 
                          : 'text.secondary' 
                      }}
                    />
                  </Box>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
}

export default Navigation; 