import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  LinearProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Download as DownloadIcon, 
  Assessment as AssessmentIcon,
  FilterList as FilterIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { 
  mockAttendance, 
  mockFaculty, 
  mockSchedules,
  getDepartmentStats 
} from '../utils/mockData';

function AttendanceReports() {
  const [attendance, setAttendance] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [filters, setFilters] = useState({
    faculty_id: '',
    date: '',
    subject: '',
    department: '',
    status: '',
  });
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    attendanceRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [departmentStats, setDepartmentStats] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFaculty(mockFaculty);
      setAttendance(mockAttendance);
      setDepartmentStats(getDepartmentStats());
      calculateStats(mockAttendance);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    const present = data.filter(a => a.status === 'present').length;
    const absent = data.filter(a => a.status === 'absent').length;
    const attendanceRate = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

    setStats({
      total,
      present,
      absent,
      attendanceRate,
    });
  };

  const handleFilterChange = (field) => (event) => {
    setFilters({
      ...filters,
      [field]: event.target.value,
    });
  };

  const handleSearch = () => {
    let filteredData = mockAttendance;

    if (filters.faculty_id) {
      filteredData = filteredData.filter(a => a.facultyId === filters.faculty_id);
    }
    if (filters.date) {
      filteredData = filteredData.filter(a => a.date === filters.date);
    }
    if (filters.subject) {
      filteredData = filteredData.filter(a => a.subject === filters.subject);
    }
    if (filters.department) {
      const deptFaculty = mockFaculty.filter(f => f.department === filters.department);
      const deptIds = deptFaculty.map(f => f.id);
      filteredData = filteredData.filter(a => deptIds.includes(a.facultyId));
    }
    if (filters.status) {
      filteredData = filteredData.filter(a => a.status === filters.status);
    }

    setAttendance(filteredData);
    calculateStats(filteredData);
  };

  const handleExport = () => {
    const csvContent = generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generateCSV = () => {
    const headers = ['Date', 'Faculty ID', 'Name', 'Department', 'Subject', 'Classroom', 'Status', 'Time', 'Method', 'Confidence'];
    const rows = attendance.map(record => [
      new Date(record.timestamp).toLocaleDateString(),
      record.facultyId,
      record.facultyName,
      mockFaculty.find(f => f.id === record.facultyId)?.department || '',
      record.subject,
      record.classroom,
      record.status,
      new Date(record.timestamp).toLocaleTimeString(),
      record.method,
      record.confidence || 'N/A',
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const StatCard = ({ title, value, color, icon, subtitle }) => (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: `${color}.light`, color: color, mr: 2 }}>
            {icon}
          </Avatar>
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ color, fontWeight: 700 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const DepartmentReportCard = ({ department, stats }) => (
    <Card sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', mr: 2 }}>
              <SchoolIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {department}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.totalFaculty} faculty members
              </Typography>
            </Box>
          </Box>
          <Chip 
            label={`${stats.averageRate}%`} 
            color={stats.averageRate > 90 ? 'success' : stats.averageRate > 80 ? 'warning' : 'error'}
            size="small"
          />
        </Box>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Total Records
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {stats.totalAttendance}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Present
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
              {stats.presentCount}
            </Typography>
          </Grid>
        </Grid>
        
        <LinearProgress 
          variant="determinate" 
          value={parseFloat(stats.averageRate)} 
          sx={{ 
            height: 8, 
            borderRadius: 4,
            bgcolor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
            }
          }}
        />
      </CardContent>
    </Card>
  );

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar sx={{ bgcolor: 'secondary.main', mr: 2, width: 48, height: 48 }}>
          <AssessmentIcon />
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
            Attendance Reports
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Comprehensive faculty attendance analysis and reporting
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Records" 
            value={stats.total} 
            color="primary.main" 
            icon={<AssessmentIcon />}
            subtitle="All attendance entries"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Present" 
            value={stats.present} 
            color="success.main" 
            icon={<TrendingUpIcon />}
            subtitle="Faculty present"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Absent" 
            value={stats.absent} 
            color="error.main" 
            icon={<TrendingDownIcon />}
            subtitle="Faculty absent"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Attendance Rate" 
            value={`${stats.attendanceRate}%`} 
            color="info.main" 
            icon={<TrendingUpIcon />}
            subtitle="Overall performance"
          />
        </Grid>
      </Grid>

      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Detailed Reports" />
              <Tab label="Department Analysis" />
              <Tab label="Faculty Performance" />
            </Tabs>
          </Box>

          {activeTab === 0 && (
            <>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Filter Reports
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Faculty</InputLabel>
                    <Select
                      value={filters.faculty_id}
                      onChange={handleFilterChange('faculty_id')}
                      label="Faculty"
                    >
                      <MenuItem value="">All Faculty</MenuItem>
                      {faculty.map((f) => (
                        <MenuItem key={f.id} value={f.id}>
                          {f.name} ({f.id})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label="Date"
                    value={filters.date}
                    onChange={handleFilterChange('date')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Subject</InputLabel>
                    <Select
                      value={filters.subject}
                      onChange={handleFilterChange('subject')}
                      label="Subject"
                    >
                      <MenuItem value="">All Subjects</MenuItem>
                      {Array.from(new Set(mockSchedules.map(s => s.subject))).map((subject) => (
                        <MenuItem key={subject} value={subject}>
                          {subject}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Department</InputLabel>
                    <Select
                      value={filters.department}
                      onChange={handleFilterChange('department')}
                      label="Department"
                    >
                      <MenuItem value="">All Departments</MenuItem>
                      {Array.from(new Set(faculty.map(f => f.department))).map((dept) => (
                        <MenuItem key={dept} value={dept}>
                          {dept}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filters.status}
                      onChange={handleFilterChange('status')}
                      label="Status"
                    >
                      <MenuItem value="">All Status</MenuItem>
                      <MenuItem value="present">Present</MenuItem>
                      <MenuItem value="absent">Absent</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<SearchIcon />}
                      onClick={handleSearch}
                      size="small"
                    >
                      Search
                    </Button>
                    <Tooltip title="Export CSV">
                      <IconButton onClick={handleExport} color="primary">
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Grid>
              </Grid>
            </>
          )}

          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Department Performance Analysis
              </Typography>
              {Object.entries(departmentStats).map(([dept, stats]) => (
                <DepartmentReportCard key={dept} department={dept} stats={stats} />
              ))}
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Faculty Performance Overview
              </Typography>
              <List>
                {faculty.map((facultyMember) => {
                  const facultyAttendance = attendance.filter(a => a.facultyId === facultyMember.id);
                  const presentCount = facultyAttendance.filter(a => a.status === 'present').length;
                  const totalCount = facultyAttendance.length;
                  const rate = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(1) : 0;
                  
                  return (
                    <ListItem key={facultyMember.id} sx={{ borderRadius: 2, mb: 1, bgcolor: 'background.default' }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={facultyMember.name}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {facultyMember.department} • {facultyMember.subject}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Typography variant="body2" color="text.secondary">
                                {presentCount}/{totalCount} present
                              </Typography>
                              <Chip 
                                label={`${rate}%`}
                                size="small"
                                color={rate > 90 ? 'success' : rate > 80 ? 'warning' : 'error'}
                              />
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          )}
        </CardContent>
      </Card>

      {activeTab === 0 && (
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Attendance Records
              </Typography>
              <Chip 
                label={`${attendance.length} records`} 
                color="primary" 
                size="small"
              />
            </Box>
            
            {loading ? (
              <Box sx={{ width: '100%' }}>
                <LinearProgress />
                <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                  Loading attendance data...
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Faculty</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Subject</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Classroom</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Method</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendance.slice(0, 50).map((record, index) => {
                      const facultyMember = faculty.find(f => f.id === record.facultyId);
                      return (
                        <TableRow key={index} hover>
                          <TableCell>{new Date(record.timestamp).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.light' }}>
                                <PersonIcon />
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {record.facultyName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {record.facultyId}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>{facultyMember?.department || '-'}</TableCell>
                          <TableCell>{record.subject}</TableCell>
                          <TableCell>{record.classroom}</TableCell>
                          <TableCell>
                            <Chip
                              label={record.status}
                              color={record.status === 'present' ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{new Date(record.timestamp).toLocaleTimeString()}</TableCell>
                          <TableCell>
                            <Chip
                              label={record.method}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            
            {attendance.length === 0 && !loading && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  No attendance records found for the selected filters
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default AttendanceReports; 