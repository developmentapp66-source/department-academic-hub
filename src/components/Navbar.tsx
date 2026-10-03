import React, { useState } from 'react';
import { StudentUser } from '../types';
import { LogOut, Menu, X, ChevronDown } from 'lucide-react';

interface NavbarProps {
  currentUser: StudentUser;
  currentTab: 'dashboard' | 'notes' | 'papers' | 'manuals' | 'announcements';
  onSelectTab: (tab: 'dashboard' | 'notes' | 'papers' | 'manuals' | 'announcements') => void;
  onLogout: () => void;
  selectedSemester: number;
  onSelectSemester: (sem: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentTab,
  onSelectTab,
  onLogout,
  selectedSemester,
  onSelectSemester,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSemDropdown, setShowSemDropdown] = useState(false);

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const navLinks: { id: 'dashboard' | 'notes' | 'papers' | 'manuals' | 'announcements'; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'notes', label: 'Notes' },
    { id: 'papers', label: 'Question Papers' },
    { id: 'manuals', label: 'Lab Manuals' },
    { id: 'announcements', label: 'Announcements' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Brand Zone - Single text element wordmark */}
          <button
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2.5 text-left focus:outline-hidden group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-xs">
              AH
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
              Department Academic Hub
            </span>
          </button>

          {/* Zone 2: Navigation Links (desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onSelectTab(link.id)}
                  className={`relative py-1.5 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-slate-950 font-semibold'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions - Semester Switcher & User / Logout */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Semester Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSemDropdown(!showSemDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
              >
                <span>Sem {selectedSemester}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showSemDropdown && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 animate-in fade-in duration-150">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Sem
                  </div>
                  {semesters.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        onSelectSemester(s);
                        setShowSemDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                        selectedSemester === s
                          ? 'bg-slate-100 font-semibold text-slate-900'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>Semester {s}</span>
                      {selectedSemester === s && <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User USN info */}
            <div className="text-right hidden lg:block">
              <div className="text-xs font-semibold text-slate-900">{currentUser.name}</div>
              <div className="text-[11px] font-mono text-slate-500">{currentUser.usn}</div>
            </div>

            {/* Logout button */}
            <button
              onClick={onLogout}
              title="Log out of session"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-slate-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-900">{currentUser.name}</div>
              <div className="text-xs font-mono text-slate-500">{currentUser.usn} · Sem {currentUser.semester}</div>
            </div>
            <button
              onClick={onLogout}
              className="text-xs text-red-600 font-medium px-2 py-1 bg-red-50 rounded border border-red-200"
            >
              Logout
            </button>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onSelectTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                  currentTab === link.id
                    ? 'bg-slate-900 text-white font-medium'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="text-xs font-medium text-slate-500 mb-2">Switch Active Semester</div>
            <div className="grid grid-cols-4 gap-1.5">
              {semesters.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    onSelectSemester(s);
                    setMobileMenuOpen(false);
                  }}
                  className={`py-1.5 text-xs rounded text-center font-medium ${
                    selectedSemester === s
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Sem {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
