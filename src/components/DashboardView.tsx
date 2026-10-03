import React, { useMemo } from 'react';
import {
  StudentUser,
  Subject,
  NoteItem,
  QuestionPaperItem,
  LabManualItem,
  AnnouncementItem,
  RecentlyAddedItem,
} from '../types';
import { INSTITUTION_INFO } from '../data/mockData';
import {
  BookOpen,
  FileText,
  FlaskConical,
  Bell,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Download,
  Eye,
  Clock,
  Layers,
  Building2,
  Calendar,
  CheckCircle2,
  Bookmark,
  AlertCircle,
} from 'lucide-react';
import { useToast } from './Toast';

interface DashboardViewProps {
  currentUser: StudentUser;
  subjects: Subject[];
  notes: NoteItem[];
  papers: QuestionPaperItem[];
  manuals: LabManualItem[];
  announcements: AnnouncementItem[];
  onNavigateTab: (tab: 'dashboard' | 'chem3' | 'notes' | 'papers' | 'manuals' | 'announcements') => void;
  onOpenNote: (note: NoteItem) => void;
  onOpenPaper: (paper: QuestionPaperItem) => void;
  onOpenExperiment: (exp: any, manual: LabManualItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  subjects,
  notes,
  papers,
  manuals,
  announcements,
  onNavigateTab,
  onOpenNote,
  onOpenPaper,
  onOpenExperiment,
}) => {
  const { showToast } = useToast();

  // Metrics for current semester (default 3rd semester Chemical Engineering)
  const semesterNotes = useMemo(() => notes.filter((n) => n.semester === currentUser.semester), [notes, currentUser.semester]);
  const semesterPapers = useMemo(() => papers.filter((p) => p.semester === currentUser.semester), [papers, currentUser.semester]);
  const semesterManuals = useMemo(() => manuals.filter((m) => m.semester === currentUser.semester), [manuals, currentUser.semester]);
  const currentSemesterSubjects = useMemo(() => subjects.filter((s) => s.semester === currentUser.semester), [subjects, currentUser.semester]);

  // Construct "Recently Added" items list
  const recentlyAddedList: RecentlyAddedItem[] = useMemo(() => {
    const list: RecentlyAddedItem[] = [
      {
        type: 'note',
        item: notes[0], // Material & Energy Balances Unit 1
        addedDate: 'Added 2 days ago',
        category: 'Lecture Notes',
      },
      {
        type: 'paper',
        item: papers[0], // 2024 SEE Material Balances
        addedDate: 'Uploaded this week',
        category: 'Exam Paper (with solutions)',
      },
      {
        type: 'manual',
        item: manuals[0], // Fluid Flow Operations Lab
        addedDate: 'Updated yesterday',
        category: 'Laboratory Guide',
      },
      {
        type: 'note',
        item: notes[2] || notes[1], // Fluid Mechanics Unit 1
        addedDate: 'Added 4 days ago',
        category: 'Lecture Notes',
      },
    ];
    return list;
  }, [notes, papers, manuals]);

  const handleDownload = (filename: string) => {
    showToast(`Downloading: ${filename}`, 'success');
  };

  return (
    <div className="space-y-8">
      {/* 1. SIT Tumakuru Academic Welcome Banner */}
      <div className="relative overflow-hidden bg-linear-to-r from-blue-950 via-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-md">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* Institution Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-blue-200 border border-white/15">
              <Building2 className="w-3.5 h-3.5 text-blue-300" />
              <span>Siddaganga Institute of Technology, Tumakuru</span>
            </div>

            {/* Department • Semester Header */}
            <div>
              <div className="text-sm font-semibold tracking-wide text-blue-300 uppercase mb-1">
                Chemical Engineering • 3rd Semester
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Welcome back, {currentUser.name}
              </h1>
            </div>

            <p className="text-sm text-blue-100/90 leading-relaxed">
              Access your department's verified lecture notes, previous question papers, and laboratory experiment manuals for Chemical Engineering Semester {currentUser.semester}.
            </p>

            {/* Direct Jump to Dedicated 3rd Sem Hub */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigateTab('chem3')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open Chemical Engg – 3rd Sem Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Academic Profile Capsule */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shrink-0 flex flex-col gap-2.5 min-w-[280px]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-200 border-b border-white/15 pb-2 flex items-center justify-between">
              <span>SIT Student Profile</span>
              <span className="font-mono text-white bg-blue-950/70 px-2 py-0.5 rounded border border-white/15">
                {currentUser.usn}
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-blue-100">
              <div className="flex justify-between">
                <span className="text-blue-200/80">Institution:</span>
                <span className="font-semibold text-white text-right">SIT Tumakuru</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200/80">Department:</span>
                <span className="font-semibold text-white">{currentUser.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200/80">Semester & Sec:</span>
                <span className="font-semibold text-white">Semester {currentUser.semester} (Sec {currentUser.section})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200/80">Academic Year:</span>
                <span className="font-mono text-white">{currentUser.academicYear}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-white/10 text-[11px]">
                <span className="text-blue-200/80">SIT Webmail:</span>
                <span className="font-mono text-blue-200 truncate max-w-[150px]">{currentUser.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Syllabus Notice Banner */}
      <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900 leading-relaxed shadow-2xs">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-amber-950">Curriculum & Demo Data Notice: </strong>
          <span>
            Subjects, course codes (marked with <strong>[DEMO]</strong>, e.g. <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">CH31-DEMO</code>), and materials displayed on this portal represent realistic placeholder content for 3rd-Semester Chemical Engineering at SIT Tumakuru until your official autonomous syllabus document is finalized.
          </span>
        </div>
      </div>

      {/* 2. Statistical Resource Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              3rd Semester Chemical Engineering Resources
            </h2>
            <p className="text-xs text-slate-500">
              Verified materials currently uploaded for Semester {currentUser.semester}
            </p>
          </div>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/80">
            Semester {currentUser.semester} Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Notes Count */}
          <div
            onClick={() => onNavigateTab('notes')}
            className="group relative bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-blue-50 text-blue-700 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-2xs">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono text-slate-900 group-hover:text-blue-600 transition-colors">
                    {semesterNotes.length}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Available Units</div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Lecture Notes
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Material balances, fluid statics, process calculations, and faculty slide decks.
                </p>
              </div>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
              <span>Browse Notes</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Question Papers Count */}
          <div
            onClick={() => onNavigateTab('papers')}
            className="group relative bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-2xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {semesterPapers.length}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Papers Archive</div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Question Papers
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Semester End Exam archives (2023–2024) and official marking schemes.
                </p>
              </div>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
              <span>View Exam Archive</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Lab Manuals Count */}
          <div
            onClick={() => onNavigateTab('manuals')}
            className="group relative bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-amber-50 text-amber-700 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors shadow-2xs">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono text-slate-900 group-hover:text-amber-600 transition-colors">
                    {semesterManuals.length}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Lab Manuals</div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  Lab Manuals
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Fluid Flow Operations Lab & Technical Chemistry experiment procedures and viva Q&A.
                </p>
              </div>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-700">
              <span>Open Lab Guides</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Announcements Count */}
          <div
            onClick={() => onNavigateTab('announcements')}
            className="group relative bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-rose-50 text-rose-700 rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-colors shadow-2xs">
                  <Bell className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono text-slate-900 group-hover:text-rose-600 transition-colors">
                    {announcements.length}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Notices</div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                  Announcements
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  SIT circulars, CIE examination timetables, and IIChE student chapter activities.
                </p>
              </div>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-rose-700">
              <span>Read Notice Board</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. "Recently Added" Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Recently Added Resources
              </h2>
              <p className="text-xs text-slate-500">
                Latest 3rd-Semester Chemical Engineering uploads for SIT Tumakuru
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full self-start sm:self-auto font-mono">
            Latest uploads
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {recentlyAddedList.map((entry, idx) => {
            const isNote = entry.type === 'note';
            const isPaper = entry.type === 'paper';
            const isManual = entry.type === 'manual';

            const title = isNote
              ? `${(entry.item as NoteItem).subjectCode}: ${(entry.item as NoteItem).title}`
              : isPaper
              ? `${(entry.item as QuestionPaperItem).subjectName} (${(entry.item as QuestionPaperItem).year} ${(entry.item as QuestionPaperItem).examType})`
              : `${(entry.item as LabManualItem).courseCode}: ${(entry.item as LabManualItem).courseName}`;

            const subtitle = isNote
              ? `Unit ${(entry.item as NoteItem).unit} · Author: ${(entry.item as NoteItem).author} · ${(entry.item as NoteItem).fileSize}`
              : isPaper
              ? `Marks: ${(entry.item as QuestionPaperItem).totalMarks} · Scheme: ${(entry.item as QuestionPaperItem).scheme} · ${(entry.item as QuestionPaperItem).fileSize}`
              : `${(entry.item as LabManualItem).totalExperiments} Prescribed Experiments · In-charge: ${(entry.item as LabManualItem).labIncharge}`;

            const downloadName = isNote
              ? (entry.item as NoteItem).downloadFileName
              : isPaper
              ? (entry.item as QuestionPaperItem).downloadFileName
              : (entry.item as LabManualItem).downloadFileName;

            return (
              <div
                key={idx}
                className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/70 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl shrink-0 mt-0.5 bg-slate-100 text-slate-700">
                    {isNote && <BookOpen className="w-4 h-4 text-blue-600" />}
                    {isPaper && <FileText className="w-4 h-4 text-emerald-600" />}
                    {isManual && <FlaskConical className="w-4 h-4 text-amber-600" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs mb-1">
                      <span className="font-semibold text-slate-600 text-[11px]">
                        {entry.category}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[11px] text-blue-700 font-semibold font-mono">
                        {entry.addedDate}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 line-clamp-1">
                      {title}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {subtitle}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => {
                      if (isNote) onOpenNote(entry.item as NoteItem);
                      else if (isPaper) onOpenPaper(entry.item as QuestionPaperItem);
                      else if (isManual) onOpenExperiment((entry.item as LabManualItem).experiments[0], entry.item as LabManualItem);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleDownload(downloadName)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Two-Column Layout: 3rd Semester Registered Subjects & High-Priority SIT Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column: Registered 3rd Sem Subjects */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                SIT Chemical Engineering • 3rd Semester Subjects
              </h2>
              <p className="text-xs text-slate-500">
                Current semester syllabus modules and direct access to notes
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
              {currentSemesterSubjects.length} Courses
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {currentSemesterSubjects.map((sub) => {
              const subNotes = notes.filter((n) => n.subjectCode === sub.code);
              return (
                <div
                  key={sub.code}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 px-2 rounded-xl transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded">
                        {sub.code}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-500 font-medium">
                        {sub.credits} Credits · {sub.category}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      {sub.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      Faculty: <span className="text-slate-700 font-medium">{sub.faculty}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {subNotes.length > 0 ? (
                      <button
                        onClick={() => onOpenNote(subNotes[0])}
                        className="text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Preview Notes ({subNotes.length})
                      </button>
                    ) : (
                      <button
                        onClick={() => onNavigateTab('manuals')}
                        className="text-xs font-semibold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Lab Manual
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Latest Announcements Notice Board */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-rose-600" />
                <h2 className="text-base font-bold text-slate-900">SIT Notice Board</h2>
              </div>
              <button
                onClick={() => onNavigateTab('announcements')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                View all ({announcements.length})
              </button>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigateTab('announcements')}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 transition-colors cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-rose-700 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className="text-slate-400 font-mono">{item.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-950 space-y-1">
              <div className="font-bold text-blue-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                CIE-1 Timetable Announced
              </div>
              <p className="text-blue-900/80 text-[11px] leading-relaxed">
                Chemical Engineering 3rd-semester CIE-1 tests commence from November 4, 2024. Review Module 1 & 2 notes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
