import React, { useState } from 'react';
import { StudentUser } from '../types';
import { INSTITUTION_INFO } from '../data/mockData';
import {
  isSupabaseConfigured,
  supabase,
  deriveEmailFromUsn,
  getOrSyncStudentProfile,
} from '../lib/supabase';
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  User,
  Loader2,
  Settings,
  GraduationCap,
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: StudentUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [usn, setUsn] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showConfigGuide, setShowConfigGuide] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanUsn = usn.trim().toUpperCase();
    if (!cleanUsn) {
      setErrorMessage('Please enter your University Seat Number (USN).');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    // Verify Supabase configuration before attempting authentication
    if (!isSupabaseConfigured) {
      setErrorMessage(
        'Supabase authentication environment variables are not yet configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable authentication.'
      );
      return;
    }

    // Real Supabase Authentication: USN + Password with derived internal email
    const internalEmail = deriveEmailFromUsn(cleanUsn);
    setIsLoading(true);

    try {
      if (authMode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: internalEmail,
          password,
        });

        if (error) {
          if (
            error.message.toLowerCase().includes('invalid login credentials') ||
            error.message.toLowerCase().includes('invalid credentials')
          ) {
            throw new Error(
              `Invalid USN or password for "${cleanUsn}". If you have not created your account yet, please click "Register USN" above.`
            );
          }
          if (error.message.toLowerCase().includes('email not confirmed')) {
            throw new Error(
              'Account requires confirmation. To allow instant USN logins, ensure "Confirm email" is turned off in your Supabase Auth provider settings.'
            );
          }
          throw error;
        }

        if (data.user) {
          // Fetch student profile from student_profiles table (or sync initial data)
          const studentProfile = await getOrSyncStudentProfile(data.user, cleanUsn);
          onLogin(studentProfile);
        }
      } else {
        // Sign Up (Register new student USN)
        if (!fullName.trim()) {
          throw new Error('Please enter your full name to register your USN.');
        }

        const { data, error } = await supabase.auth.signUp({
          email: internalEmail,
          password,
          options: {
            data: {
              usn: cleanUsn,
              full_name: fullName.trim(),
              institution: INSTITUTION_INFO.name,
              department: 'Chemical Engineering',
              dept_code: 'CH',
              semester: 3,
              section: 'A',
              academic_year: '2024–2025',
            },
          },
        });

        if (error) {
          if (
            error.message.toLowerCase().includes('already registered') ||
            error.message.toLowerCase().includes('user already exists')
          ) {
            throw new Error(`USN "${cleanUsn}" is already registered. Please sign in with your password.`);
          }
          throw error;
        }

        if (data.session?.user) {
          // Instant session granted
          const studentProfile = await getOrSyncStudentProfile(data.session.user, cleanUsn);
          onLogin(studentProfile);
        } else if (data.user) {
          // Registration succeeded; attempt direct sign-in
          const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
            email: internalEmail,
            password,
          });

          if (!signInErr && signInData.user) {
            const studentProfile = await getOrSyncStudentProfile(signInData.user, cleanUsn);
            onLogin(studentProfile);
          } else {
            setSuccessMessage(
              `Account registered for USN "${cleanUsn}"! Please sign in with your password.`
            );
            setAuthMode('signin');
          }
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center relative overflow-hidden font-sans py-8">
      {/* Background Campus Image with Deep Collegiate Blue Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/academic_campus_hero_1791032238852.jpg"
          alt="SIT Tumakuru Campus"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-30 filter brightness-75 contrast-125"
        />
        <div className="absolute inset-0 bg-linear-to-b from-blue-950/85 via-slate-950/90 to-slate-950" />
      </div>

      <div className="relative z-10 max-w-lg w-full mx-auto px-4 sm:px-6">
        {/* Academic Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-7 sm:p-9 backdrop-blur-md">
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 shadow-md mb-3.5 overflow-hidden border-2 border-blue-600/30 ring-4 ring-blue-50">
              <img
                src="/src/assets/images/academic_crest_symbol_1791032252645.jpg"
                alt="SIT Crest"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold tracking-wide uppercase text-blue-700">
                {INSTITUTION_INFO.name}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Chemical Engineering Academic Hub
              </h1>
              <div className="inline-flex items-center gap-1.5 mt-1 text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-full">
                <GraduationCap className="w-3.5 h-3.5 text-blue-700" />
                <span>3rd Semester Portal · USN Login</span>
              </div>
            </div>
          </div>

          {/* Supabase Status Banner */}
          {isSupabaseConfigured ? (
            <div className="mb-5 p-3 bg-emerald-50/90 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Supabase USN Auth Connected</span>
              </div>
              <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-700 font-semibold">
                Database Auth
              </span>
            </div>
          ) : (
            <div className="mb-5 p-3.5 bg-amber-50/90 border border-amber-200 rounded-xl text-xs text-amber-950 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Supabase Environment Pending</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfigGuide(!showConfigGuide)}
                  className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 underline flex items-center gap-1"
                >
                  <Settings className="w-3 h-3" />
                  <span>Setup Guide</span>
                </button>
              </div>
              <p className="text-[11px] text-amber-900/80 leading-relaxed">
                Add <code className="bg-amber-100/90 px-1 py-0.5 rounded font-mono font-bold text-amber-950">VITE_SUPABASE_URL</code> and <code className="bg-amber-100/90 px-1 py-0.5 rounded font-mono font-bold text-amber-950">VITE_SUPABASE_ANON_KEY</code> to your Vercel project environment variables to activate authentication.
              </p>

              {showConfigGuide && (
                <div className="mt-2 pt-2 border-t border-amber-200/80 text-[11px] space-y-1 font-mono text-slate-800 bg-white/70 p-2.5 rounded-lg">
                  <div className="font-bold text-slate-900 font-sans">Required Vercel Variables:</div>
                  <div>1. <span className="font-bold text-blue-700">VITE_SUPABASE_URL</span> = https://[project-ref].supabase.co</div>
                  <div>2. <span className="font-bold text-blue-700">VITE_SUPABASE_ANON_KEY</span> = [anon-public-key]</div>
                </div>
              )}
            </div>
          )}

          {/* Mode Tabs: Sign In vs Register USN */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                setAuthMode('signin');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                authMode === 'signin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In with USN
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                setAuthMode('signup');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                authMode === 'signup'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Register USN
            </button>
          </div>

          {/* Login / Registration Form: USN + Password */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl font-medium flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{successMessage}</span>
              </div>
            )}

            {authMode === 'signup' && (
              <div>
                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Student Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="name"
                    type="text"
                    disabled={isLoading}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Darshan Gowda"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors shadow-2xs"
                    required
                  />
                </div>
              </div>
            )}

            {/* USN Input */}
            <div>
              <label htmlFor="usn" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                University Seat Number (USN)
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="usn"
                  type="text"
                  disabled={isLoading}
                  value={usn}
                  onChange={(e) => setUsn(e.target.value.toUpperCase())}
                  placeholder="e.g. 1SI23CH015"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-mono font-semibold uppercase tracking-wider transition-colors shadow-2xs"
                  required
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Enter your official SIT seat number (e.g. <span className="font-mono text-slate-700 font-bold">1SI23CH015</span>)
              </span>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="pass" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <span className="text-[11px] text-blue-600 font-medium">
                  {isSupabaseConfigured ? 'Secured by Supabase' : 'Auth Required'}
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="pass"
                  type={showPassword ? 'text' : 'password'}
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={authMode === 'signup' ? 'Create a secure password (min 6 chars)' : 'Enter your password'}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors shadow-2xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button with Loading State */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-sm font-bold tracking-wide transition-all shadow-md shadow-blue-600/20 hover:shadow-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying USN with Supabase...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {authMode === 'signup'
                        ? 'Register SIT Student Account'
                        : 'Sign In with USN'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-7 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Authenticated directly via Supabase Auth & RLS</span>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6 text-xs text-blue-200/80">
          Siddaganga Institute of Technology, Tumakuru · Department of Chemical Engineering
        </div>
      </div>
    </div>
  );
};
