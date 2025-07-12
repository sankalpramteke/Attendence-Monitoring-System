// Mock data for Faculty Attendance Monitoring System

export const mockFaculty = [
  {
    id: 'FAC001',
    name: 'Dr. Sarah Johnson',
    department: 'Computer Science',
    subject: 'Data Structures & Algorithms',
    email: 'sarah.johnson@college.edu',
    phone: '+1-555-0101',
    office: 'Room 301, CS Building',
    faceImage: null,
    status: 'active',
    joinDate: '2020-08-15',
    attendanceRate: 94.5
  },
  {
    id: 'FAC002',
    name: 'Prof. Michael Chen',
    department: 'Electrical Engineering',
    subject: 'Digital Electronics',
    email: 'michael.chen@college.edu',
    phone: '+1-555-0102',
    office: 'Room 205, EE Building',
    faceImage: null,
    status: 'active',
    joinDate: '2019-03-20',
    attendanceRate: 89.2
  },
  {
    id: 'FAC003',
    name: 'Dr. Emily Rodriguez',
    department: 'Mathematics',
    subject: 'Calculus & Linear Algebra',
    email: 'emily.rodriguez@college.edu',
    phone: '+1-555-0103',
    office: 'Room 102, Math Building',
    faceImage: null,
    status: 'active',
    joinDate: '2021-01-10',
    attendanceRate: 96.8
  },
  {
    id: 'FAC004',
    name: 'Prof. David Thompson',
    department: 'Mechanical Engineering',
    subject: 'Thermodynamics',
    email: 'david.thompson@college.edu',
    phone: '+1-555-0104',
    office: 'Room 401, ME Building',
    faceImage: null,
    status: 'active',
    joinDate: '2018-09-05',
    attendanceRate: 91.3
  },
  {
    id: 'FAC005',
    name: 'Dr. Lisa Wang',
    department: 'Computer Science',
    subject: 'Machine Learning',
    email: 'lisa.wang@college.edu',
    phone: '+1-555-0105',
    office: 'Room 302, CS Building',
    faceImage: null,
    status: 'active',
    joinDate: '2022-02-28',
    attendanceRate: 88.7
  },
  {
    id: 'FAC006',
    name: 'Prof. James Wilson',
    department: 'Physics',
    subject: 'Quantum Mechanics',
    email: 'james.wilson@college.edu',
    phone: '+1-555-0106',
    office: 'Room 201, Physics Building',
    faceImage: null,
    status: 'active',
    joinDate: '2020-11-12',
    attendanceRate: 93.1
  },
  {
    id: 'FAC007',
    name: 'Dr. Maria Garcia',
    department: 'Chemistry',
    subject: 'Organic Chemistry',
    email: 'maria.garcia@college.edu',
    phone: '+1-555-0107',
    office: 'Room 105, Chemistry Building',
    faceImage: null,
    status: 'active',
    joinDate: '2019-07-22',
    attendanceRate: 95.4
  },
  {
    id: 'FAC008',
    name: 'Prof. Robert Kim',
    department: 'Civil Engineering',
    subject: 'Structural Analysis',
    email: 'robert.kim@college.edu',
    phone: '+1-555-0108',
    office: 'Room 501, CE Building',
    faceImage: null,
    status: 'active',
    joinDate: '2021-05-15',
    attendanceRate: 90.6
  }
];

export const mockSchedules = [
  {
    id: 'SCH001',
    facultyId: 'FAC001',
    subject: 'Data Structures & Algorithms',
    classroom: 'CS-101',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
    capacity: 45,
    status: 'active'
  },
  {
    id: 'SCH002',
    facultyId: 'FAC002',
    subject: 'Digital Electronics',
    classroom: 'EE-201',
    day: 'Monday',
    startTime: '11:00',
    endTime: '12:30',
    capacity: 35,
    status: 'active'
  },
  {
    id: 'SCH003',
    facultyId: 'FAC003',
    subject: 'Calculus & Linear Algebra',
    classroom: 'MATH-301',
    day: 'Tuesday',
    startTime: '09:00',
    endTime: '10:30',
    capacity: 60,
    status: 'active'
  },
  {
    id: 'SCH004',
    facultyId: 'FAC004',
    subject: 'Thermodynamics',
    classroom: 'ME-401',
    day: 'Tuesday',
    startTime: '14:00',
    endTime: '15:30',
    capacity: 40,
    status: 'active'
  },
  {
    id: 'SCH005',
    facultyId: 'FAC005',
    subject: 'Machine Learning',
    classroom: 'CS-202',
    day: 'Wednesday',
    startTime: '10:00',
    endTime: '11:30',
    capacity: 30,
    status: 'active'
  },
  {
    id: 'SCH006',
    facultyId: 'FAC006',
    subject: 'Quantum Mechanics',
    classroom: 'PHYS-201',
    day: 'Wednesday',
    startTime: '13:00',
    endTime: '14:30',
    capacity: 25,
    status: 'active'
  },
  {
    id: 'SCH007',
    facultyId: 'FAC007',
    subject: 'Organic Chemistry',
    classroom: 'CHEM-105',
    day: 'Thursday',
    startTime: '09:00',
    endTime: '10:30',
    capacity: 50,
    status: 'active'
  },
  {
    id: 'SCH008',
    facultyId: 'FAC008',
    subject: 'Structural Analysis',
    classroom: 'CE-501',
    day: 'Friday',
    startTime: '11:00',
    endTime: '12:30',
    capacity: 35,
    status: 'active'
  }
];

// Generate mock attendance data for the last 30 days
export const generateMockAttendance = () => {
  const attendance = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Generate attendance for each faculty member
    mockFaculty.forEach(faculty => {
      const schedule = mockSchedules.find(s => s.facultyId === faculty.id);
      if (schedule) {
        // Random attendance based on faculty's attendance rate
        const isPresent = Math.random() * 100 < faculty.attendanceRate;
        
        attendance.push({
          id: `ATT_${faculty.id}_${dateStr}`,
          facultyId: faculty.id,
          facultyName: faculty.name,
          subject: schedule.subject,
          classroom: schedule.classroom,
          date: dateStr,
          timestamp: new Date(date.getTime() + (Math.random() * 8 + 8) * 60 * 60 * 1000).toISOString(),
          status: isPresent ? 'present' : 'absent',
          method: isPresent ? 'face_recognition' : 'manual',
          confidence: isPresent ? (Math.random() * 20 + 80).toFixed(1) : null
        });
      }
    });
  }
  
  return attendance.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const mockAttendance = generateMockAttendance();

// Department statistics
export const getDepartmentStats = () => {
  const stats = {};
  mockFaculty.forEach(faculty => {
    if (!stats[faculty.department]) {
      stats[faculty.department] = {
        totalFaculty: 0,
        totalAttendance: 0,
        presentCount: 0,
        averageRate: 0
      };
    }
    stats[faculty.department].totalFaculty++;
  });
  
  // Calculate attendance stats for each department
  Object.keys(stats).forEach(dept => {
    const deptFaculty = mockFaculty.filter(f => f.department === dept);
    const deptAttendance = mockAttendance.filter(a => 
      deptFaculty.some(f => f.id === a.facultyId)
    );
    
    stats[dept].totalAttendance = deptAttendance.length;
    stats[dept].presentCount = deptAttendance.filter(a => a.status === 'present').length;
    stats[dept].averageRate = deptAttendance.length > 0 
      ? ((stats[dept].presentCount / stats[dept].totalAttendance) * 100).toFixed(1)
      : 0;
  });
  
  return stats;
};

// Today's attendance summary
export const getTodayAttendance = () => {
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = mockAttendance.filter(a => a.date === today);
  
  return {
    total: todayAttendance.length,
    present: todayAttendance.filter(a => a.status === 'present').length,
    absent: todayAttendance.filter(a => a.status === 'absent').length,
    rate: todayAttendance.length > 0 
      ? ((todayAttendance.filter(a => a.status === 'present').length / todayAttendance.length) * 100).toFixed(1)
      : 0
  };
};

// Recent attendance for dashboard
export const getRecentAttendance = (limit = 10) => {
  return mockAttendance.slice(0, limit);
}; 