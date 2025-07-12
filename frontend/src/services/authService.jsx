// Authentication Service for Faculty Attendance Monitoring System
import { createContext, useContext, useState, useEffect } from 'react';

// Mock user data for demonstration
const mockUsers = [
  {
    id: 1,
    email: 'admin@college.edu',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    department: 'IT',
    facultyId: 'ADM001'
  },
  {
    id: 2,
    email: 'faculty@college.edu',
    password: 'faculty123',
    name: 'Dr. Sarah Johnson',
    role: 'faculty',
    department: 'Computer Science',
    facultyId: 'CS001'
  },
  {
    id: 3,
    email: 'hod@college.edu',
    password: 'hod123',
    name: 'Prof. Michael Chen',
    role: 'hod',
    department: 'Computer Science',
    facultyId: 'CS002'
  }
];

// Authentication Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Authentication Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedToken = localStorage.getItem('authToken');
    
    if (savedUser && savedToken) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in mock data
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Create session token
      const token = `token_${user.id}_${Date.now()}`;
      
      // Remove password from user object
      const { password: _, ...userWithoutPassword } = user;
      
      // Save to localStorage
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      localStorage.setItem('authToken', token);
      
      setCurrentUser(userWithoutPassword);
      setIsAuthenticated(true);
      
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      const existingUser = mockUsers.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Create new user
      const newUser = {
        id: mockUsers.length + 1,
        ...userData,
        role: 'faculty', // Default role for new registrations
        facultyId: `${userData.department.substring(0, 2).toUpperCase()}${String(mockUsers.length + 1).padStart(3, '0')}`
      };

      // In a real app, this would be saved to database
      mockUsers.push(newUser);
      
      // Auto-login after registration
      const { password: _, ...userWithoutPassword } = newUser;
      const token = `token_${newUser.id}_${Date.now()}`;
      
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      localStorage.setItem('authToken', token);
      
      setCurrentUser(userWithoutPassword);
      setIsAuthenticated(true);
      
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (updatedData) => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser = { ...currentUser, ...updatedData };
      
      // Update localStorage
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      
      return { success: true, user: updatedUser };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Change password function
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verify current password
      const user = mockUsers.find(u => u.id === currentUser.id);
      if (!user || user.password !== currentPassword) {
        throw new Error('Current password is incorrect');
      }
      
      // Update password in mock data
      user.password = newPassword;
      
      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return currentUser?.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(currentUser?.role);
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    updateProfile,
    changePassword,
    hasRole,
    hasAnyRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the context for direct use if needed
export { AuthContext }; 