
import { useContext } from 'react';
// FIX: Corrected import path for AuthContext to its actual location.
import { AuthContext } from '../components/admin/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
