import React, { useState, useEffect } from 'react';
import { StudentUser, NoteItem, QuestionPaperItem, LabExperiment, LabManualItem } from './types';
import {
  DEMO_STUDENTS,
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
import { DocumentModal } from './components/DocumentModal';
import { ToastProvider } from './components/Toast';

export default function App() {
  // Current Student Session (starts at null for login view)
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(null);

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

  // Listen to Supabase Auth State changes & restore active sessions
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // 1. Check existing active session on load
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const student = await getOrSyncStudentProfile(session.user);
        setCurrentUser(student);
        setActiveSemester(student.semester || 3);
      }
    });

    // 2. Subscribe to auth events (SIGN_IN, SIGN_OUT, USER_UPDATED)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const student = await getOrSyncStudentProfile(session.user);
        setCurrentUser(student);
        setActiveSemester(student.semester || 3);
      } else {
        setCurrentUser(null);
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

  return (
    <ToastProvider>
      {!currentUser ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
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

            {/* Quiet Academic Footer */}
            <footer className="border-t border-slate-200 bg-white py-6 mt-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{INSTITUTION_INFO.name}</span>
                  <span>·</span>
                  <span>Department of {INSTITUTION_INFO.department}</span>
                  <span>·</span>
                  <span className="font-mono text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {isSupabaseConfigured ? 'Supabase Auth' : 'Demo Auth'}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span>Student: <strong className="text-slate-700 font-semibold">{currentUser.name}</strong> ({currentUser.usn})</span>
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
      )}
    </ToastProvider>
  );
}
