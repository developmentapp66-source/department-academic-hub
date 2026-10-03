import React, { useState } from 'react';
import { StudentUser } from '../types';
import { DEMO_STUDENTS, INSTITUTION_INFO } from '../data/mockData';
import {
  Lock,
  UserCheck,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  School,
  Building2,
  BookOpen,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: StudentUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [usn, setUsn] = useState('1SI23CH015');
  const [password, setPassword] = useState('student@123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUsn = usn.trim().toUpperCase();
    if (!cleanUsn) {
      setError('Please enter your University Seat Number (USN).');
      return;
    }
    if (!password) {
      setError('Please enter your student password.');
      return;
    }

    // Match with demo students or dynamically generate student profile
    const matched = DEMO_STUDENTS.find((s) => s.usn.toUpperCase() === cleanUsn);
    if (matched) {
      onLogin(matched);
      return;
    }

    // Dynamic student profile for arbitrary input
    const defaultStudent: StudentUser = {
      usn: cleanUsn,
      name: `Student (${cleanUsn})`,
      institution: INSTITUTION_INFO.name,
      department: 'Chemical Engineering',
      deptCode: 'CH',
      semester: 3,
      section: 'A',
      academicYear: '2024–2025',
      email: `${cleanUsn.toLowerCase()}@sit.ac.in`,
    };
    onLogin(defaultStudent);
  };

  const handleSelectDemo = (student: StudentUser) => {
    setUsn(student.usn);
    setPassword('student@123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center relative overflow-hidden font-sans">
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

      <div className="relative z-10 max-w-lg w-full mx-auto px-4 sm:px-6 py-10">
        {/* Academic Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-8 sm:p-10 backdrop-blur-md">
          {/* Logo & Text Treatment */}
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
                Siddaganga Institute of Technology, Tumakuru
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Chemical Engineering Academic Hub
              </h1>
              <div className="inline-block mt-1 text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-full">
                3rd Semester Repository
              </div>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl font-medium">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="usn" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                University Seat Number (USN)
              </label>
              <div className="relative">
                <input
                  id="usn"
                  type="text"
                  value={usn}
                  onChange={(e) => setUsn(e.target.value)}
                  placeholder="e.g. 1SI23CH015"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-mono transition-colors shadow-2xs"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="pass" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <span className="text-[11px] text-blue-600 font-medium">Demo enabled</span>
              </div>
              <div className="relative">
                <input
                  id="pass"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your student password"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors pr-10 shadow-2xs"
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

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold tracking-wide transition-all shadow-md shadow-blue-600/20 hover:shadow-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              >
                <span>Login to SIT Chemical Engg Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Demo Accounts Selection */}
          <div className="mt-7 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Select SIT Demo Student
              </span>
              <span className="text-[11px] text-slate-400">One-click log in</span>
            </div>

            <div className="space-y-2">
              {DEMO_STUDENTS.map((demo) => {
                const isCurrent = usn.toUpperCase() === demo.usn;
                return (
                  <button
                    key={demo.usn}
                    type="button"
                    onClick={() => handleSelectDemo(demo)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                      isCurrent
                        ? 'border-blue-600 bg-blue-50/70 font-semibold shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900">{demo.name}</div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {demo.usn} · {demo.department} · Sem {demo.semester}
                      </div>
                    </div>
                    <UserCheck className={`w-4 h-4 ${isCurrent ? 'text-blue-600' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 text-center mt-3 leading-relaxed">
              Or type any custom SIT USN and password to access the repository.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6 text-xs text-blue-200/80">
          Siddaganga Institute of Technology, Tumakuru · Autonomous Engineering Repository
        </div>
      </div>
    </div>
  );
};
