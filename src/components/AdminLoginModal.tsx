import React, { useState } from 'react';
import { StudentUser } from '../types';
import { INSTITUTION_INFO } from '../data/mockData';
import {
  isSupabaseConfigured,
  supabase,
  deriveEmailFromUsn,
  checkIsAdmin,
  getOrSyncStudentProfile,
} from '../lib/supabase';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Loader2,
  X,
  AlertCircle,
  KeyRound,
  GraduationCap,
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminLoginSuccess: (adminUser: StudentUser) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onAdminLoginSuccess,
}) => {
  const [adminIdOrEmail, setAdminIdOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanInput = adminIdOrEmail.trim();
    if (!cleanInput) {
      setErrorMessage('Please enter your Faculty / Administrator Email or ID.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your administrator password.');
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMessage(
        'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable authentication.'
      );
      return;
    }

    const email = cleanInput.includes('@') ? cleanInput.toLowerCase() : deriveEmailFromUsn(cleanInput);
    setIsLoading(true);

    try {
      // 1. Authenticate with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (
          error.message.toLowerCase().includes('invalid login credentials') ||
          error.message.toLowerCase().includes('invalid credentials')
        ) {
          throw new Error('Invalid administrator credentials.');
        }
        throw error;
      }

      if (!data.user) {
        throw new Error('Failed to retrieve authentication token.');
      }

      // 2. SECURITY CHECK: Verify user role from Supabase database table (RLS guarded)
      const isAdmin = await checkIsAdmin(data.user);

      if (!isAdmin) {
        // Immediately revoke session so normal students cannot hold authenticated tokens against admin endpoints
        await supabase.auth.signOut();
        throw new Error(
          'Access Denied: Your account does not have department administrator privileges. Only authorized faculty and department administrators may access this console.'
        );
      }

      // 3. User is verified admin -> retrieve profile and grant access
      const adminProfile = await getOrSyncStudentProfile(data.user);
      if (adminProfile.role !== 'super_admin') {
        adminProfile.role = 'faculty_admin';
      }
      onAdminLoginSuccess(adminProfile);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Administrator authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-7 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border-2 border-blue-600/30 text-white flex items-center justify-center mx-auto shadow-md">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
          </div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-blue-600">
            SIT Chemical Engineering
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Administrator Portal Login
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            Restricted to department faculty and authorized administrators. Role-Level Security (RLS) is strictly verified.
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAdminSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Admin Email or Faculty ID
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                disabled={isLoading}
                value={adminIdOrEmail}
                onChange={(e) => setAdminIdOrEmail(e.target.value)}
                placeholder="admin@sit.ac.in or faculty ID"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Administrator Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Administrator Privileges...</span>
                </>
              ) : (
                <>
                  <span>Sign In as Administrator</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Note */}
        <div className="pt-2 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Standard student accounts are automatically denied access. Permissions are verified against the Supabase database.
          </p>
        </div>
      </div>
    </div>
  );
};
