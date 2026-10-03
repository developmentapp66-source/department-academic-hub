import React from 'react';
import { StudentUser } from '../types';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  FlaskConical,
  Bell,
  LogOut,
  X,
  ChevronRight,
  ShieldCheck,
  Building2,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  currentUser: StudentUser;
  currentTab: 'dashboard' | 'notes' | 'papers' | 'manuals' | 'announcements';
  onSelectTab: (tab: 'dashboard' | 'notes' | 'papers' | 'manuals' | 'announcements') => void;
  onLogout: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  counts: {
    notes: number;
    papers: number;
    manuals: number;
    announcements: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  currentTab,
  onSelectTab,
  onLogout,
  isOpenMobile,
  onCloseMobile,
  counts,
}) => {
  const navItems = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      description: 'Overview & quick access',
    },
    {
      id: 'notes' as const,
      label: 'Lecture Notes',
      icon: BookOpen,
      badge: `${counts.notes}`,
      description: 'Syllabus units & slides',
    },
    {
      id: 'papers' as const,
      label: 'Question Papers',
      icon: FileText,
      badge: `${counts.papers}`,
      description: 'SEE & IA exam archives',
    },
    {
      id: 'manuals' as const,
      label: 'Lab Manuals',
      icon: FlaskConical,
      badge: `${counts.manuals}`,
      description: 'Code & experiment steps',
    },
    {
      id: 'announcements' as const,
      label: 'Announcements',
      icon: Bell,
      badge: `${counts.announcements} new`,
      isAlert: true,
      description: 'Circulars & deadlines',
    },
  ];

  const handleNavClick = (tab: 'dashboard' | 'notes' | 'papers' | 'manuals' | 'announcements') => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top: Branding & Close Button on Mobile */}
        <div className="flex flex-col">
          <div className="px-5 py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-xs border border-slate-200 bg-slate-900 shrink-0">
                <img
                  src="/src/assets/images/academic_crest_symbol_1791032252645.jpg"
                  alt="Academic Emblem"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 tracking-tight leading-none">
                  Department Hub
                </span>
                <span className="text-[11px] text-blue-600 font-semibold tracking-wide uppercase mt-1">
                  Academic Portal
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Department Tagline Banner */}
          <div className="px-5 py-3 bg-blue-50/50 border-b border-blue-100/60 flex items-center gap-2 text-[11px] text-blue-900 font-medium">
            <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">Dept of {currentUser.deptCode} · Semester {currentUser.semester}</span>
          </div>

          {/* Navigation Items */}
          <div className="px-3 py-4 space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Main Menu
            </div>
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="block leading-snug">{item.label}</span>
                      <span
                        className={`text-[10px] font-normal block ${
                          isActive ? 'text-blue-100' : 'text-slate-400'
                        }`}
                      >
                        {item.description}
                      </span>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-white text-blue-700'
                          : item.isAlert
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Section: Student Profile Card & Logout */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/70 space-y-2">
          {/* User Profile Card */}
          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {currentUser.name}
                </div>
                <div className="text-[11px] font-mono text-slate-500 truncate">
                  {currentUser.usn}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Section {currentUser.section}</span>
              <span className="font-semibold text-slate-700 font-mono">Sem {currentUser.semester}</span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
