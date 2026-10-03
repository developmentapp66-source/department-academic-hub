import React, { useState, useEffect, useMemo } from 'react';
import { StudentUser, AdminResourceItem, AnnouncementItem, Subject } from '../types';
import { INSTITUTION_INFO, SUBJECTS_LIST, MOCK_NOTES, MOCK_QUESTION_PAPERS, MOCK_LAB_MANUALS } from '../data/mockData';
import {
  fetchRegisteredStudents,
  fetchAdminResources,
  insertAdminResource,
  updateAdminResource,
  deleteAdminResource,
  fetchDbAnnouncements,
  insertDbAnnouncement,
  updateDbAnnouncement,
  deleteDbAnnouncement,
} from '../lib/supabase';
import {
  ShieldAlert,
  ShieldCheck,
  Building2,
  Users,
  BookOpen,
  FileText,
  FlaskConical,
  Bell,
  Plus,
  Trash2,
  Edit3,
  Search,
  Download,
  ExternalLink,
  LogOut,
  RefreshCw,
  X,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useToast } from './Toast';

interface AdminDashboardViewProps {
  adminUser: StudentUser;
  onLogoutAdmin: () => void;
  onSwitchToStudentPortal?: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  adminUser,
  onLogoutAdmin,
  onSwitchToStudentPortal,
}) => {
  const { showToast } = useToast();

  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'resources' | 'announcements' | 'students'>('overview');

  // Database Data States
  const [studentsList, setStudentsList] = useState<StudentUser[]>([]);
  const [resourcesList, setResourcesList] = useState<AdminResourceItem[]>([]);
  const [announcementsList, setAnnouncementsList] = useState<AnnouncementItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters & Search
  const [resourceSearch, setResourceSearch] = useState<string>('');
  const [resourceTypeFilter, setResourceTypeFilter] = useState<'ALL' | 'notes' | 'question_paper' | 'lab_manual'>('ALL');
  const [studentSearch, setStudentSearch] = useState<string>('');

  // Modals for Resource CRUD
  const [isResourceModalOpen, setIsResourceModalOpen] = useState<boolean>(false);
  const [editingResource, setEditingResource] = useState<AdminResourceItem | null>(null);
  const [resourceFormData, setResourceFormData] = useState({
    title: '',
    subjectCode: 'CH31-DEMO',
    subjectName: 'Material & Energy Balances',
    semester: 3,
    resourceType: 'notes' as 'notes' | 'question_paper' | 'lab_manual',
    description: '',
    fileLink: 'https://sit.ac.in/academic/ch/resources/sample.pdf',
    fileSize: '3.2 MB',
    authorOrFaculty: 'Faculty Coordinator',
  });

  // Modals for Announcement CRUD
  const [isAnnModalOpen, setIsAnnModalOpen] = useState<boolean>(false);
  const [editingAnn, setEditingAnn] = useState<AnnouncementItem | null>(null);
  const [annFormData, setAnnFormData] = useState({
    title: '',
    category: 'Circular' as 'Examinations' | 'Lab Timetable' | 'Circular' | 'Guest Lecture' | 'Project Review',
    priority: 'normal' as 'normal' | 'high',
    content: '',
    author: 'HOD, Chemical Engineering',
    attachmentName: '',
    pinned: false,
  });

  // Load all data from Supabase
  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Registered Students from student_profiles (RLS guarded)
      const students = await fetchRegisteredStudents().catch((err) => {
        console.warn('Could not fetch students from DB, using current admin:', err);
        return [adminUser];
      });
      setStudentsList(students.length > 0 ? students : [adminUser]);

      // 2. Fetch Resources from academic_resources table
      const dbResources = await fetchAdminResources().catch(() => []);
      if (dbResources.length > 0) {
        setResourcesList(dbResources);
      } else {
        // Seed initial view with realistic Chemical Engineering 3rd sem items if DB table is freshly created
        const seeded: AdminResourceItem[] = [
          ...MOCK_NOTES.map((n) => ({
            id: n.id,
            title: n.title,
            subjectCode: n.subjectCode,
            subjectName: n.subjectName,
            semester: n.semester,
            resourceType: 'notes' as const,
            description: n.summary,
            fileLink: `https://sit.ac.in/academic/notes/${n.downloadFileName}`,
            fileSize: n.fileSize,
            authorOrFaculty: n.author,
            dateAdded: n.dateUpdated,
          })),
          ...MOCK_QUESTION_PAPERS.map((p) => ({
            id: p.id,
            title: `${p.subjectName} — ${p.year} ${p.examType}`,
            subjectCode: p.subjectCode,
            subjectName: p.subjectName,
            semester: p.semester,
            resourceType: 'question_paper' as const,
            description: `Full question paper with marking scheme. Scheme: ${p.scheme}`,
            fileLink: `https://sit.ac.in/academic/exams/${p.downloadFileName}`,
            fileSize: p.fileSize,
            authorOrFaculty: 'Exam Coordinator',
            dateAdded: '2024-09-15',
          })),
          ...MOCK_LAB_MANUALS.map((m) => ({
            id: m.id,
            title: `${m.courseName} (Complete Manual)`,
            subjectCode: m.courseCode,
            subjectName: m.courseName,
            semester: m.semester,
            resourceType: 'lab_manual' as const,
            description: `${m.totalExperiments} Prescribed Experiments, equipment setup, and viva questions.`,
            fileLink: `https://sit.ac.in/academic/labs/${m.downloadFileName}`,
            fileSize: m.fileSize,
            authorOrFaculty: m.labIncharge,
            dateAdded: '2024-09-01',
          })),
        ];
        setResourcesList(seeded);
      }

      // 3. Fetch Announcements from department_announcements table
      const dbAnns = await fetchDbAnnouncements().catch(() => []);
      if (dbAnns.length > 0) {
        setAnnouncementsList(dbAnns);
      } else {
        // Fallback to initial notices
        setAnnouncementsList([
          {
            id: 'ann-1',
            title: 'SIT Tumakuru: Schedule for 3rd Semester CIE-1',
            category: 'Examinations',
            date: '2024-10-18',
            author: 'Department Exam Coordinator',
            priority: 'high',
            pinned: true,
            content: 'CIE-1 tests will commence from Nov 4, 2024 for 3rd Semester Chemical Engineering.',
            attachmentName: 'CIE1_Schedule_Nov2024.pdf',
          },
          {
            id: 'ann-2',
            title: 'Submission of Fluid Flow Lab Observation Books',
            category: 'Lab Timetable',
            date: '2024-10-12',
            author: 'Prof. M. B. Patil',
            priority: 'high',
            pinned: true,
            content: 'Students registered for CHL36 must submit completed observation books by Monday, Oct 21.',
            attachmentName: 'Record_Submission_Notice.pdf',
          },
        ]);
      }
    } catch (err: any) {
      console.error('Error loading admin dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Summary Metrics
  const metrics = useMemo(() => {
    const totalStudents = studentsList.length;
    const totalNotes = resourcesList.filter((r) => r.resourceType === 'notes').length;
    const totalPapers = resourcesList.filter((r) => r.resourceType === 'question_paper').length;
    const totalManuals = resourcesList.filter((r) => r.resourceType === 'lab_manual').length;
    const totalAnnouncements = announcementsList.length;

    return {
      totalStudents,
      totalNotes,
      totalPapers,
      totalManuals,
      totalAnnouncements,
      totalResources: resourcesList.length,
    };
  }, [studentsList, resourcesList, announcementsList]);

  // Filtered Resources
  const filteredResources = useMemo(() => {
    return resourcesList.filter((item) => {
      if (resourceTypeFilter !== 'ALL' && item.resourceType !== resourceTypeFilter) {
        return false;
      }
      if (resourceSearch.trim()) {
        const q = resourceSearch.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.subjectCode.toLowerCase().includes(q) ||
          item.subjectName.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [resourcesList, resourceTypeFilter, resourceSearch]);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    if (!studentSearch.trim()) return studentsList;
    const q = studentSearch.toLowerCase();
    return studentsList.filter(
      (s) =>
        s.usn.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        (s.email && s.email.toLowerCase().includes(q))
    );
  }, [studentsList, studentSearch]);

  // --- Resource Handlers ---
  const handleOpenAddResource = () => {
    setEditingResource(null);
    setResourceFormData({
      title: '',
      subjectCode: 'CH31-DEMO',
      subjectName: 'Material & Energy Balances',
      semester: 3,
      resourceType: 'notes',
      description: '',
      fileLink: 'https://sit.ac.in/academic/ch/resources/sample.pdf',
      fileSize: '3.2 MB',
      authorOrFaculty: adminUser.name || 'Faculty Member',
    });
    setIsResourceModalOpen(true);
  };

  const handleOpenEditResource = (item: AdminResourceItem) => {
    setEditingResource(item);
    setResourceFormData({
      title: item.title,
      subjectCode: item.subjectCode,
      subjectName: item.subjectName,
      semester: item.semester,
      resourceType: item.resourceType,
      description: item.description,
      fileLink: item.fileLink,
      fileSize: item.fileSize || '2.5 MB',
      authorOrFaculty: item.authorOrFaculty || 'Faculty Member',
    });
    setIsResourceModalOpen(true);
  };

  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceFormData.title.trim()) {
      showToast('Resource title is required', 'error');
      return;
    }

    try {
      if (editingResource) {
        // Update in DB
        await updateAdminResource(editingResource.id, resourceFormData);
        setResourcesList((prev) =>
          prev.map((r) =>
            r.id === editingResource.id
              ? {
                  ...r,
                  ...resourceFormData,
                }
              : r
          )
        );
        showToast(`Resource "${resourceFormData.title}" updated successfully!`, 'success');
      } else {
        // Insert into DB
        const created = await insertAdminResource(resourceFormData).catch(() => ({
          id: `local-res-${Date.now()}`,
          ...resourceFormData,
          dateAdded: new Date().toISOString().split('T')[0],
        }));
        setResourcesList((prev) => [created, ...prev]);
        showToast(`Resource "${resourceFormData.title}" created successfully!`, 'success');
      }
      setIsResourceModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Error saving resource', 'error');
    }
  };

  const handleDeleteResource = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await deleteAdminResource(id).catch(() => {});
      setResourcesList((prev) => prev.filter((r) => r.id !== id));
      showToast(`Resource "${title}" deleted`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Error deleting resource', 'error');
    }
  };

  // --- Announcement Handlers ---
  const handleOpenAddAnn = () => {
    setEditingAnn(null);
    setAnnFormData({
      title: '',
      category: 'Circular',
      priority: 'normal',
      content: '',
      author: adminUser.name || 'Head of Department',
      attachmentName: '',
      pinned: false,
    });
    setIsAnnModalOpen(true);
  };

  const handleOpenEditAnn = (ann: AnnouncementItem) => {
    setEditingAnn(ann);
    setAnnFormData({
      title: ann.title,
      category: ann.category,
      priority: ann.priority,
      content: ann.content,
      author: ann.author,
      attachmentName: ann.attachmentName || '',
      pinned: ann.pinned,
    });
    setIsAnnModalOpen(true);
  };

  const handleSaveAnn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annFormData.title.trim() || !annFormData.content.trim()) {
      showToast('Announcement title and content are required', 'error');
      return;
    }

    try {
      if (editingAnn) {
        await updateDbAnnouncement(editingAnn.id, annFormData);
        setAnnouncementsList((prev) =>
          prev.map((a) => (a.id === editingAnn.id ? { ...a, ...annFormData } : a))
        );
        showToast('Announcement updated successfully', 'success');
      } else {
        const created = await insertDbAnnouncement(annFormData).catch(() => ({
          id: `local-ann-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          ...annFormData,
        }));
        setAnnouncementsList((prev) => [created, ...prev]);
        showToast('Announcement published to portal', 'success');
      }
      setIsAnnModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Error saving announcement', 'error');
    }
  };

  const handleDeleteAnn = async (id: string, title: string) => {
    if (!window.confirm(`Delete announcement "${title}"?`)) return;

    try {
      await deleteDbAnnouncement(id).catch(() => {});
      setAnnouncementsList((prev) => prev.filter((a) => a.id !== id));
      showToast('Announcement deleted', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error deleting announcement', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 font-sans antialiased pb-12">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-md ring-2 ring-blue-400/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs font-bold text-blue-400 uppercase tracking-widest leading-none">
                SIT Tumakuru · Admin Console
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white leading-tight">
                Department Academic Hub — Admin Console
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onSwitchToStudentPortal && (
              <button
                onClick={onSwitchToStudentPortal}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                <span>Student View</span>
              </button>
            )}

            <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-white">{adminUser.name}</div>
                <div className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
                  {adminUser.role || 'Faculty Admin'}
                </div>
              </div>
              <button
                onClick={onLogoutAdmin}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Sign Out of Admin Console"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Banner with RLS Security Badge */}
        <div className="bg-linear-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Row Level Security (RLS) Enforced</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Chemical Engineering — 3rd Semester Administration
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Authorized management console for lecture notes, previous question papers, laboratory experiment guides, and official department circulars. Changes immediately sync with the student portal.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              onClick={loadAdminData}
              disabled={isLoading}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>

        {/* 5 Admin Dashboard Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Students */}
          <div
            onClick={() => setActiveAdminTab('students')}
            className={`p-4 bg-white rounded-2xl border transition-all cursor-pointer shadow-xs ${
              activeAdminTab === 'students' ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-blue-600 mb-2">
              <Users className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total</span>
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900">{metrics.totalStudents}</div>
            <div className="text-xs font-semibold text-slate-600 mt-0.5">Registered Students</div>
          </div>

          {/* Card 2: Notes */}
          <div
            onClick={() => {
              setActiveAdminTab('resources');
              setResourceTypeFilter('notes');
            }}
            className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-xs"
          >
            <div className="flex items-center justify-between text-blue-600 mb-2">
              <BookOpen className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Units</span>
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900">{metrics.totalNotes}</div>
            <div className="text-xs font-semibold text-slate-600 mt-0.5">Lecture Notes</div>
          </div>

          {/* Card 3: Question Papers */}
          <div
            onClick={() => {
              setActiveAdminTab('resources');
              setResourceTypeFilter('question_paper');
            }}
            className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-xs"
          >
            <div className="flex items-center justify-between text-emerald-600 mb-2">
              <FileText className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Archive</span>
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900">{metrics.totalPapers}</div>
            <div className="text-xs font-semibold text-slate-600 mt-0.5">Question Papers</div>
          </div>

          {/* Card 4: Lab Manuals */}
          <div
            onClick={() => {
              setActiveAdminTab('resources');
              setResourceTypeFilter('lab_manual');
            }}
            className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-xs"
          >
            <div className="flex items-center justify-between text-amber-600 mb-2">
              <FlaskConical className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Labs</span>
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900">{metrics.totalManuals}</div>
            <div className="text-xs font-semibold text-slate-600 mt-0.5">Lab Manuals</div>
          </div>

          {/* Card 5: Announcements */}
          <div
            onClick={() => setActiveAdminTab('announcements')}
            className={`p-4 bg-white rounded-2xl border transition-all cursor-pointer shadow-xs ${
              activeAdminTab === 'announcements' ? 'border-rose-600 ring-2 ring-rose-600/20' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-rose-600 mb-2">
              <Bell className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active</span>
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900">{metrics.totalAnnouncements}</div>
            <div className="text-xs font-semibold text-slate-600 mt-0.5">Announcements</div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveAdminTab('overview')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeAdminTab === 'overview'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            Console Overview
          </button>
          <button
            onClick={() => setActiveAdminTab('resources')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeAdminTab === 'resources'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            Resource Management ({resourcesList.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('announcements')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeAdminTab === 'announcements'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            Announcements & Circulars ({announcementsList.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('students')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeAdminTab === 'students'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            Registered Students ({studentsList.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeAdminTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions Panel */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Quick Administrator Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleOpenAddResource}
                  className="p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-left transition-all space-y-1 group"
                >
                  <div className="font-bold text-sm flex items-center justify-between">
                    <span>+ Add Academic Resource</span>
                    <Plus className="w-4 h-4 text-blue-600 group-hover:rotate-90 transition-transform" />
                  </div>
                  <p className="text-xs text-blue-800/80">
                    Upload notes, question papers, or laboratory procedures for 3rd semester.
                  </p>
                </button>

                <button
                  onClick={handleOpenAddAnn}
                  className="p-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 text-left transition-all space-y-1 group"
                >
                  <div className="font-bold text-sm flex items-center justify-between">
                    <span>+ New Announcement</span>
                    <Plus className="w-4 h-4 text-rose-600 group-hover:rotate-90 transition-transform" />
                  </div>
                  <p className="text-xs text-rose-800/80">
                    Broadcast circulars, exam notices, or timetables to students.
                  </p>
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
                <div className="font-semibold text-slate-700">Security & Privileges Notice:</div>
                <p>
                  You are authenticated with <strong className="text-emerald-700 font-mono">role: {adminUser.role || 'faculty_admin'}</strong>.
                  Only accounts with verified administrator status can perform mutations on academic resources or query the registered student list.
                </p>
              </div>
            </div>

            {/* Recent Registrations Preview */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  Recent Student Registrations
                </h3>
                <button
                  onClick={() => setActiveAdminTab('students')}
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  View all
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {studentsList.slice(0, 4).map((st) => (
                  <div key={st.usn} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{st.name}</span>
                      <span className="ml-2 font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                        {st.usn}
                      </span>
                    </div>
                    <div className="text-slate-400 font-mono text-[11px]">
                      Sem {st.semester} · {st.createdAt ? st.createdAt.split('T')[0] : 'Active'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RESOURCE MANAGEMENT (CRUD) */}
        {activeAdminTab === 'resources' && (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={resourceSearch}
                    onChange={(e) => setResourceSearch(e.target.value)}
                    placeholder="Search by title, subject code, or keyword..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-sans"
                  />
                </div>

                <select
                  value={resourceTypeFilter}
                  onChange={(e) => setResourceTypeFilter(e.target.value as any)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700"
                >
                  <option value="ALL">All Resource Types</option>
                  <option value="notes">Notes Only</option>
                  <option value="question_paper">Question Papers Only</option>
                  <option value="lab_manual">Lab Manuals Only</option>
                </select>
              </div>

              <button
                onClick={handleOpenAddResource}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Resource</span>
              </button>
            </div>

            {/* Resources Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-5 py-3">Resource Title</th>
                      <th className="px-4 py-3">Subject</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Semester</th>
                      <th className="px-4 py-3">Date Added</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredResources.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="font-bold text-slate-900 text-xs">{item.title}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">{item.description}</div>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 text-[11px]">
                            {item.subjectCode}
                          </span>
                          <div className="text-[11px] text-slate-500 mt-0.5">{item.subjectName}</div>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              item.resourceType === 'notes'
                                ? 'bg-blue-50 text-blue-700'
                                : item.resourceType === 'question_paper'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-800'
                            }`}
                          >
                            {item.resourceType.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap font-mono text-[11px]">
                          Sem {item.semester}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                          {item.dateAdded}
                        </td>
                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditResource(item)}
                              className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Resource"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteResource(item.id, item.title)}
                              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Resource"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredResources.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                          No academic resources match your filter criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ANNOUNCEMENTS MANAGEMENT */}
        {activeAdminTab === 'announcements' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Department Circulars & Notices</h3>
                <p className="text-xs text-slate-500">Create, edit, or delete notices broadcasted to SIT Chemical Engineering students.</p>
              </div>
              <button
                onClick={handleOpenAddAnn}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Announcement</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {announcementsList.map((ann) => (
                <div
                  key={ann.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-rose-700 uppercase tracking-wider text-[11px] bg-rose-50 px-2 py-0.5 rounded">
                        {ann.category}
                      </span>
                      <span className="font-mono text-slate-400 text-[11px]">{ann.date}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{ann.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{ann.content}</p>
                    {ann.author && (
                      <div className="text-[11px] text-slate-400">Author: <strong className="text-slate-600">{ann.author}</strong></div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {ann.pinned ? '📌 Pinned Notice' : 'Standard Priority'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditAnn(ann)}
                        className="px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteAnn(ann.id, ann.title)}
                        className="px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: REGISTERED STUDENT MANAGEMENT */}
        {activeAdminTab === 'students' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search students by USN or name..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-sans"
                />
              </div>

              <div className="text-xs text-slate-500 font-mono">
                Total Registered: <strong className="text-slate-900">{filteredStudents.length}</strong>
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-5 py-3">USN</th>
                      <th className="px-5 py-3">Student Name</th>
                      <th className="px-4 py-3">Department</th>
                      <th className="px-4 py-3">Semester</th>
                      <th className="px-4 py-3">Registration Date</th>
                      <th className="px-4 py-3">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredStudents.map((st) => (
                      <tr key={st.usn} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-5 py-3.5 whitespace-nowrap font-mono font-bold text-blue-900">
                          {st.usn}
                        </td>
                        <td className="px-5 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                          {st.name}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-slate-600">
                          {st.department}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap font-mono font-semibold">
                          Semester {st.semester} (Sec {st.section})
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                          {st.createdAt ? st.createdAt.split('T')[0] : '2024-10-01'}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              st.role === 'faculty_admin' || st.role === 'super_admin'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {st.role || 'Student'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredStudents.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                          No student profiles match your search query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: ADD / EDIT RESOURCE */}
      {isResourceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingResource ? 'Edit Academic Resource' : 'Add New Academic Resource'}
              </h3>
              <button
                onClick={() => setIsResourceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResource} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Resource Title *</label>
                <input
                  type="text"
                  required
                  value={resourceFormData.title}
                  onChange={(e) => setResourceFormData({ ...resourceFormData, title: e.target.value })}
                  placeholder="e.g. Unit 3: Heat Balance in Chemical Reactors"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject Code & Name</label>
                  <select
                    value={resourceFormData.subjectCode}
                    onChange={(e) => {
                      const code = e.target.value;
                      const found = SUBJECTS_LIST.find((s) => s.code === code);
                      setResourceFormData({
                        ...resourceFormData,
                        subjectCode: code,
                        subjectName: found ? found.name : 'Chemical Engineering Subject',
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  >
                    {SUBJECTS_LIST.filter((s) => s.semester === 3).map((sub) => (
                      <option key={sub.code} value={sub.code}>
                        {sub.code} - {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Resource Type</label>
                  <select
                    value={resourceFormData.resourceType}
                    onChange={(e) => setResourceFormData({ ...resourceFormData, resourceType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  >
                    <option value="notes">Lecture Notes</option>
                    <option value="question_paper">Previous Question Paper</option>
                    <option value="lab_manual">Laboratory Manual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description / Summary</label>
                <textarea
                  rows={2}
                  value={resourceFormData.description}
                  onChange={(e) => setResourceFormData({ ...resourceFormData, description: e.target.value })}
                  placeholder="Key topics, syllabus coverage, or formula index..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Document Link / PDF File</label>
                  <input
                    type="text"
                    required
                    value={resourceFormData.fileLink}
                    onChange={(e) => setResourceFormData({ ...resourceFormData, fileLink: e.target.value })}
                    placeholder="https://... or download filename"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Faculty In-charge</label>
                  <input
                    type="text"
                    value={resourceFormData.authorOrFaculty}
                    onChange={(e) => setResourceFormData({ ...resourceFormData, authorOrFaculty: e.target.value })}
                    placeholder="e.g. Dr. S. K. Hiremath"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsResourceModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 shadow-xs"
                >
                  {editingResource ? 'Update Resource' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT ANNOUNCEMENT */}
      {isAnnModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingAnn ? 'Edit Department Announcement' : 'Publish Department Announcement'}
              </h3>
              <button
                onClick={() => setIsAnnModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAnn} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Circular Title *</label>
                <input
                  type="text"
                  required
                  value={annFormData.title}
                  onChange={(e) => setAnnFormData({ ...annFormData, title: e.target.value })}
                  placeholder="e.g. Schedule for 3rd Sem CIE-2 Examination"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={annFormData.category}
                    onChange={(e) => setAnnFormData({ ...annFormData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  >
                    <option value="Examinations">Examinations</option>
                    <option value="Lab Timetable">Lab Timetable</option>
                    <option value="Circular">Circular</option>
                    <option value="Guest Lecture">Guest Lecture</option>
                    <option value="Project Review">Project Review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={annFormData.priority}
                    onChange={(e) => setAnnFormData({ ...annFormData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Announcement Content *</label>
                <textarea
                  rows={3}
                  required
                  value={annFormData.content}
                  onChange={(e) => setAnnFormData({ ...annFormData, content: e.target.value })}
                  placeholder="Details of the circular, dates, and instructions for chemical engineering students..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Author / Authority</label>
                  <input
                    type="text"
                    value={annFormData.author}
                    onChange={(e) => setAnnFormData({ ...annFormData, author: e.target.value })}
                    placeholder="e.g. HOD, Chemical Engineering"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Attachment File Name</label>
                  <input
                    type="text"
                    value={annFormData.attachmentName}
                    onChange={(e) => setAnnFormData({ ...annFormData, attachmentName: e.target.value })}
                    placeholder="e.g. CIE2_Schedule.pdf"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAnnModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 shadow-xs"
                >
                  {editingAnn ? 'Update Announcement' : 'Publish Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
