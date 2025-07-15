import React, { createContext, useContext, useState, useEffect } from 'react';

// Mock users for demonstration
const mockUsers = [
  {
    id: 1,
    email: 'admin@college.edu',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    department: 'Administration',
  },
  {
    id: 2,
    email: 'hod@college.edu',
    password: 'hod123',
    name: 'HOD User',
    role: 'hod',
    department: 'Computer Science',
  },
  {
    id: 3,
    email: 'faculty@college.edu',
    password: 'faculty123',
    name: 'Faculty User',
    role: 'faculty',
    department: 'Mathematics',
  },
];

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user from localStorage if present
    const stored = localStorage.getItem('authUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = async (email, password) => {
    // Simulate API call
    const found = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      setUser(found);
      localStorage.setItem('authUser', JSON.stringify(found));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const register = async (data) => {
    // Simulate registration (add to mockUsers in real app)
    // Here, just allow any registration and set as logged in
    const newUser = {
      id: Date.now(),
      ...data,
      role: data.role || 'faculty',
      department: data.department || '',
    };
    setUser(newUser);
    localStorage.setItem('authUser', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
  };

  const demoLogin = (role) => {
    const found = mockUsers.find((u) => u.role === role);
    if (found) {
      setUser(found);
      localStorage.setItem('authUser', JSON.stringify(found));
      return { success: true };
    }
    return { success: false, error: 'Demo user not found' };
  };

  // Add these for ProtectedRoute compatibility
  const isAuthenticated = !!user;
  const loading = false; // Set to true if you add async user loading
  const currentUser = user;
  const hasAnyRole = (roles) => user && roles.includes(user.role);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, demoLogin, isAuthenticated, loading, currentUser, hasAnyRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 