import React, { useState } from 'react';
import { StudentUser } from '../types';
import {
  Menu,
  Bell,
  ChevronDown,
  Calendar,
  GraduationCap,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface TopHeaderProps {
  currentUser: StudentUser;
  currentTab: 'dashboard' | 'notes' | 'papers' | 'manuals' | 'announcements';
  onSelectTab: (tab: 'dashboard' | 'notes' | 'papers' | 'manuals' | 'announcements') => void;
  selectedSemester: number;
  onSelectSemester: (sem: number) => void;
  onOpenMobileMenu: () => void;
  announcementCount: number;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentUser,
  currentTab,
  onSelectTab,
  selectedSemester,
  onSelectSemester,
  onOpenMobileMenu,
  announcementCount,
}) => {
  const [showSemDropdown, setShowSemDropdown] = useState(false);
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const getBreadcrumbTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Student Dashboard';
      case 'notes':
        return 'Lecture Notes & Syllabus Modules';
      case 'papers':
        return 'Previous Year Question Papers';
      case 'manuals':
        return 'Laboratory Manuals & Code';
      case 'announcements':
        return 'Official Department Notice Board';
      default:
        return 'Academic Hub';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile hamburger & Contextual Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Open navigation sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                <span className="hover:text-slate-900 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
                  Academic Portal
                </span>
                <span>/</span>
                <span className="text-blue-600 font-semibold">{currentUser.deptCode}</span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                {getBreadcrumbTitle()}
              </h1>
            </div>
          </div>

          {/* Right: Semester Filter, Notice Bell & Student Badge */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Semester Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSemDropdown(!showSemDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100/80 rounded-lg transition-colors border border-blue-200/80 shadow-2xs whitespace-nowrap"
              >
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                <span>Semester {selectedSemester}</span>
                <ChevronDown className="w-3 h-3 text-blue-600" />
              </button>

              {showSemDropdown && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in duration-150">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Change Semester
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
                          ? 'bg-blue-50 font-bold text-blue-700'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>Semester {s}</span>
                      {selectedSemester === s && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Academic Year indicator (hidden on small screens) */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-slate-600 bg-slate-100 rounded-lg font-mono">
              <Calendar className="w-3 h-3 text-slate-500" />
              <span>{currentUser.academicYear}</span>
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => onSelectTab('announcements')}
              className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Department Notices"
              aria-label="View announcements"
            >
              <Bell className="w-4 h-4" />
              {announcementCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600 ring-2 ring-white" />
              )}
            </button>

            {/* Top Student pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  {currentUser.usn}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
