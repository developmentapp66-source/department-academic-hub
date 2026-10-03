import React, { useState, useEffect } from 'react';
import { StudentUser, NoteItem, QuestionPaperItem, LabExperiment, LabManualItem } from './types';
import {
  SUBJECTS_LIST,
  MOCK_NOTES,
  MOCK_QUESTION_PAPERS,
  MOCK_LAB_MANUALS,
  MOCK_ANNOUNCEMENTS,
  INSTITUTION_INFO,
} from './data/mockData';
import {
  isSupabaseConfigured,
  supabase,
  mapSupabaseUserToStudent,
  getOrSyncStudentProfile,
  checkIsAdmin,
} from './lib/supabase';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { LoginPage } from './components/LoginPage';
import { DashboardView } from './components/DashboardView';
import { ChemEngThirdSemView } from './components/ChemEngThirdSemView';
import { NotesView } from './components/NotesView';
import { QuestionPapersView } from './components/QuestionPapersView';
import { LabManualsView } from './components/LabManualsView';
import { AnnouncementsView } from './components/AnnouncementsView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { DocumentModal } from './components/DocumentModal';
import { ToastProvider } from './components/Toast';

export default function App() {
  // Current Student / Admin Session (starts at null)
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(null);

  // Tracks if the administrator is viewing the Admin Console
  const [isAdminView, setIsAdminView] = useState<boolean>(false);

  // Tracks session initialization on page refresh to prevent UI flickering
  const [isCheckingSession, setIsCheckingSession] = useState<boolean>(isSupabaseConfigured);

  // Active Navigation Tab
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'chem3' | 'notes' | 'papers' | 'manuals' | 'announcements'>('dashboard');

  // Active Semester filter (defaulted to 3 for Chemical Engineering 3rd sem)
  const [activeSemester, setActiveSemester] = useState<number>(3);

  // Mobile drawer state
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState<boolean>(false);

  // Document Modal Preview State
  const [activeDocument, setActiveDocument] = useState<
    | { type: 'note'; data: NoteItem }
    | { type: 'paper'; data: QuestionPaperItem }
    | { type: 'experiment'; data: LabExperiment; manual: LabManualItem }
    | null
  >(null);

  // Listen to Supabase Auth State changes & restore active sessions on page reload
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsCheckingSession(false);
      return;
    }

    // 1. Check existing active session from browser storage on load
    supabase.auth
      .getSession()
      .then(async ({ data: { session } }) => {
        if (session?.user) {
          const profile = await getOrSyncStudentProfile(session.user);
          setCurrentUser(profile);
          setActiveSemester(profile.semester || 3);

          // If returning user was an administrator, enable admin view access
          if (profile.role === 'faculty_admin' || profile.role === 'super_admin') {
            const isConfirmedAdmin = await checkIsAdmin(session.user.id);
            if (isConfirmedAdmin) {
              // Maintain role confirmation from database
              profile.role = profile.role || 'faculty_admin';
            }
          }
        }
      })
      .catch((err) => {
        console.error('Error restoring Supabase session:', err);
      })
      .finally(() => {
        setIsCheckingSession(false);
      });

    // 2. Subscribe to auth events (SIGN_IN, SIGN_OUT, TOKEN_REFRESHED, USER_UPDATED)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await getOrSyncStudentProfile(session.user);
        setCurrentUser(profile);
        setActiveSemester(profile.semester || 3);
      } else {
        setCurrentUser(null);
        setIsAdminView(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = (user: StudentUser) => {
    setCurrentUser(user);
    setActiveSemester(user.semester || 3);
    setCurrentTab('dashboard');
    setIsAdminView(false);
  };

  const handleAdminLoginSuccess = (admin: StudentUser) => {
    setCurrentUser(admin);
    setIsAdminView(true);
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Error signing out of Supabase:', err);
      }
    }
    setCurrentUser(null);
    setIsAdminView(false);
    setCurrentTab('dashboard');
    setIsSidebarOpenMobile(false);
  };

  const handleOpenNote = (note: NoteItem) => {
    setActiveDocument({ type: 'note', data: note });
  };

  const handleOpenPaper = (paper: QuestionPaperItem) => {
    setActiveDocument({ type: 'paper', data: paper });
  };

  const handleOpenExperiment = (experiment: LabExperiment, manual: LabManualItem) => {
    setActiveDocument({ type: 'experiment', data: experiment, manual });
  };

  // Dynamic counts for sidebar badges
  const navCounts = {
    notes: MOCK_NOTES.filter((n) => n.semester === (currentUser?.semester || 3)).length,
    papers: MOCK_QUESTION_PAPERS.filter((p) => p.semester === (currentUser?.semester || 3)).length,
    manuals: MOCK_LAB_MANUALS.filter((m) => m.semester === (currentUser?.semester || 3)).length,
    announcements: MOCK_ANNOUNCEMENTS.filter((a) => a.priority === 'high').length,
  };

  // Render a clean loader while restoring session on initial page load / refresh
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white px-4 font-sans">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-blue-600/30 flex items-center justify-center mb-4 shadow-xl overflow-hidden animate-pulse ring-4 ring-blue-500/10">
          <img
            src="/src/assets/images/academic_crest_symbol_1791032252645.jpg"
            alt="SIT Crest"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-xs font-bold tracking-widest uppercase text-blue-400 mb-1">
          Siddaganga Institute of Technology, Tumakuru
        </div>
        <div className="text-sm font-semibold text-slate-300">
          Verifying academic portal session...
        </div>
      </div>
    );
  }

  // If user is not logged in, show Login page with Admin Login modal capability
  if (!currentUser) {
    return (
      <ToastProvider>
        <LoginPage
          onLogin={handleLogin}
          onAdminLoginSuccess={handleAdminLoginSuccess}
        />
      </ToastProvider>
    );
  }

  // If user is in Admin view AND database-validated as faculty_admin or super_admin:
  if (isAdminView && (currentUser.role === 'faculty_admin' || currentUser.role === 'super_admin')) {
    return (
      <ToastProvider>
        <AdminDashboardView
          adminUser={currentUser}
          onLogoutAdmin={handleLogout}
          onSwitchToStudentPortal={() => setIsAdminView(false)}
        />
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        {/* Professional Sidebar Navigation */}
        <Sidebar
          currentUser={currentUser}
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onLogout={handleLogout}
          isOpenMobile={isSidebarOpenMobile}
          onCloseMobile={() => setIsSidebarOpenMobile(false)}
          counts={navCounts}
        />

        {/* Main Content Area (Offset on desktop for persistent sidebar) */}
        <div className="lg:pl-72 flex flex-col min-h-screen">
          {/* Top Bar Header */}
          <TopHeader
            currentUser={currentUser}
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            selectedSemester={activeSemester}
            onSelectSemester={setActiveSemester}
            onOpenMobileMenu={() => setIsSidebarOpenMobile(true)}
            announcementCount={navCounts.announcements}
            onOpenAdminDashboard={
              currentUser.role === 'faculty_admin' || currentUser.role === 'super_admin'
                ? () => setIsAdminView(true)
                : undefined
            }
          />

          {/* Viewport Content */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {currentTab === 'dashboard' && (
              <DashboardView
                currentUser={currentUser}
                subjects={SUBJECTS_LIST}
                notes={MOCK_NOTES}
                papers={MOCK_QUESTION_PAPERS}
                manuals={MOCK_LAB_MANUALS}
                announcements={MOCK_ANNOUNCEMENTS}
                onNavigateTab={setCurrentTab}
                onOpenNote={handleOpenNote}
                onOpenPaper={handleOpenPaper}
                onOpenExperiment={handleOpenExperiment}
              />
            )}

            {currentTab === 'chem3' && (
              <ChemEngThirdSemView
                subjects={SUBJECTS_LIST}
                notes={MOCK_NOTES}
                papers={MOCK_QUESTION_PAPERS}
                manuals={MOCK_LAB_MANUALS}
                onOpenNote={handleOpenNote}
                onOpenPaper={handleOpenPaper}
                onOpenExperiment={handleOpenExperiment}
              />
            )}

            {currentTab === 'notes' && (
              <NotesView
                notes={MOCK_NOTES}
                subjects={SUBJECTS_LIST}
                initialSemester={activeSemester}
                onOpenNote={handleOpenNote}
              />
            )}

            {currentTab === 'papers' && (
              <QuestionPapersView
                papers={MOCK_QUESTION_PAPERS}
                subjects={SUBJECTS_LIST}
                initialSemester={activeSemester}
                onOpenPaper={handleOpenPaper}
              />
            )}

            {currentTab === 'manuals' && (
              <LabManualsView
                manuals={MOCK_LAB_MANUALS}
                initialSemester={activeSemester}
                onOpenExperiment={handleOpenExperiment}
              />
            )}

            {currentTab === 'announcements' && (
              <AnnouncementsView
                announcements={MOCK_ANNOUNCEMENTS}
              />
            )}
          </main>

          {/* Academic Footer */}
          <footer className="border-t border-slate-200 bg-white py-6 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{INSTITUTION_INFO.name}</span>
                <span>·</span>
                <span>Department of {INSTITUTION_INFO.department}</span>
                <span>·</span>
                <span className="font-mono text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                  Supabase Auth & RLS
                </span>
                {(currentUser.role === 'faculty_admin' || currentUser.role === 'super_admin') && (
                  <button
                    onClick={() => setIsAdminView(true)}
                    className="ml-2 font-semibold text-blue-700 hover:text-blue-900 underline text-[11px]"
                  >
                    Switch to Admin Console &rarr;
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span>User: <strong className="text-slate-700 font-semibold">{currentUser.name}</strong> ({currentUser.usn})</span>
                <span>·</span>
                <span>AY {currentUser.academicYear} · 3rd Sem Hub</span>
              </div>
            </div>
          </footer>
        </div>

        {/* Universal Document Preview Modal */}
        <DocumentModal
          document={activeDocument}
          onClose={() => setActiveDocument(null)}
        />
      </div>
    </ToastProvider>
  );
}
