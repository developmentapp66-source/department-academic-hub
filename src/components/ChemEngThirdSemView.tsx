import React, { useState, useMemo } from 'react';
import { Subject, NoteItem, QuestionPaperItem, LabManualItem, LabExperiment } from '../types';
import { INSTITUTION_INFO } from '../data/mockData';
import {
  BookOpen,
  FileText,
  FlaskConical,
  Search,
  Filter,
  Download,
  Eye,
  AlertCircle,
  Building2,
  GraduationCap,
  Clock,
  CheckCircle2,
  ChevronDown,
  Layers,
  Sparkles,
  X,
} from 'lucide-react';
import { useToast } from './Toast';

interface ChemEngThirdSemViewProps {
  subjects: Subject[];
  notes: NoteItem[];
  papers: QuestionPaperItem[];
  manuals: LabManualItem[];
  onOpenNote: (note: NoteItem) => void;
  onOpenPaper: (paper: QuestionPaperItem) => void;
  onOpenExperiment: (exp: LabExperiment, manual: LabManualItem) => void;
}

export const ChemEngThirdSemView: React.FC<ChemEngThirdSemViewProps> = ({
  subjects,
  notes,
  papers,
  manuals,
  onOpenNote,
  onOpenPaper,
  onOpenExperiment,
}) => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>('ALL');
  const [selectedResourceType, setSelectedResourceType] = useState<'ALL' | 'notes' | 'papers' | 'manuals'>('ALL');

  // Filter 3rd Semester Chemical Engineering resources strictly
  const sem3Subjects = useMemo(() => subjects.filter((s) => s.semester === 3), [subjects]);
  const sem3Notes = useMemo(() => notes.filter((n) => n.semester === 3), [notes]);
  const sem3Papers = useMemo(() => papers.filter((p) => p.semester === 3), [papers]);
  const sem3Manuals = useMemo(() => manuals.filter((m) => m.semester === 3), [manuals]);

  // Recently added resources for 3rd Sem Chemical Engineering
  const recentlyAddedResources = useMemo(() => {
    return [
      {
        type: 'notes' as const,
        item: sem3Notes[0],
        title: `${sem3Notes[0]?.subjectCode}: ${sem3Notes[0]?.title}`,
        time: 'Added 2 days ago',
        tag: 'Lecture Notes',
      },
      {
        type: 'papers' as const,
        item: sem3Papers[0],
        title: `${sem3Papers[0]?.subjectName} (${sem3Papers[0]?.year} SEE)`,
        time: 'Uploaded this week',
        tag: 'Exam Paper (with solutions)',
      },
      {
        type: 'manuals' as const,
        item: sem3Manuals[0],
        title: `${sem3Manuals[0]?.courseCode}: ${sem3Manuals[0]?.courseName}`,
        time: 'Updated yesterday',
        tag: 'Laboratory Guide',
      },
      {
        type: 'notes' as const,
        item: sem3Notes[2] || sem3Notes[1],
        title: `${sem3Notes[2]?.subjectCode || sem3Notes[1]?.subjectCode}: ${sem3Notes[2]?.title || sem3Notes[1]?.title}`,
        time: 'Added 4 days ago',
        tag: 'Lecture Notes',
      },
    ].filter((r) => Boolean(r.item));
  }, [sem3Notes, sem3Papers, sem3Manuals]);

  const handleDownload = (filename: string) => {
    showToast(`Downloading: ${filename}`, 'success');
  };

  // Group resources by subject
  const subjectsData = useMemo(() => {
    return sem3Subjects.map((sub) => {
      const subjectNotes = sem3Notes.filter((n) => n.subjectCode === sub.code);
      const subjectPapers = sem3Papers.filter((p) => p.subjectCode === sub.code);
      const subjectManuals = sem3Manuals.filter((m) => m.courseCode === sub.code);

      return {
        subject: sub,
        notes: subjectNotes,
        papers: subjectPapers,
        manuals: subjectManuals,
      };
    });
  }, [sem3Subjects, sem3Notes, sem3Papers, sem3Manuals]);

  // Apply search and filters
  const filteredSubjectGroups = useMemo(() => {
    return subjectsData
      .filter((group) => {
        if (selectedSubjectCode !== 'ALL' && group.subject.code !== selectedSubjectCode) {
          return false;
        }
        return true;
      })
      .map((group) => {
        let matchingNotes = group.notes;
        let matchingPapers = group.papers;
        let matchingManuals = group.manuals;

        // Filter by resource type
        if (selectedResourceType === 'notes') {
          matchingPapers = [];
          matchingManuals = [];
        } else if (selectedResourceType === 'papers') {
          matchingNotes = [];
          matchingManuals = [];
        } else if (selectedResourceType === 'manuals') {
          matchingNotes = [];
          matchingPapers = [];
        }

        // Filter by search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          matchingNotes = matchingNotes.filter(
            (n) =>
              n.title.toLowerCase().includes(q) ||
              n.subjectName.toLowerCase().includes(q) ||
              n.topics.some((t) => t.toLowerCase().includes(q)) ||
              n.author.toLowerCase().includes(q)
          );
          matchingPapers = matchingPapers.filter(
            (p) =>
              p.subjectName.toLowerCase().includes(q) ||
              p.year.toString().includes(q) ||
              p.examType.toLowerCase().includes(q)
          );
          matchingManuals = matchingManuals.filter(
            (m) =>
              m.courseName.toLowerCase().includes(q) ||
              m.courseCode.toLowerCase().includes(q) ||
              m.experiments.some((e) => e.title.toLowerCase().includes(q))
          );
        }

        return {
          ...group,
          notes: matchingNotes,
          papers: matchingPapers,
          manuals: matchingManuals,
          totalCount: matchingNotes.length + matchingPapers.length + matchingManuals.length,
        };
      })
      .filter((group) => group.totalCount > 0 || (searchQuery.trim() === '' && selectedResourceType === 'ALL'));
  }, [subjectsData, selectedSubjectCode, selectedResourceType, searchQuery]);

  return (
    <div className="space-y-8">
      {/* 1. Header Banner with SIT Tumakuru Chemical Engineering Branding */}
      <div className="relative overflow-hidden bg-linear-to-r from-blue-950 via-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-md">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-blue-200 border border-white/15">
              <Building2 className="w-3.5 h-3.5 text-blue-300" />
              <span>{INSTITUTION_INFO.name}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-400/20 backdrop-blur-md rounded-full text-xs font-semibold text-amber-200 border border-amber-400/30">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Demo Curriculum Notice</span>
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Chemical Engineering — 3rd Semester
            </h1>
            <p className="text-sm text-blue-100/90 mt-2 max-w-3xl leading-relaxed">
              Centralized academic repository organized by subject. Access verified lecture notes, previous examination question papers, and laboratory experiment manuals.
            </p>
          </div>

          {/* Demo disclaimer callout */}
          <div className="p-3.5 bg-blue-900/60 border border-blue-700/60 rounded-xl text-xs text-blue-200 leading-relaxed max-w-4xl">
            <span className="font-bold text-amber-300">Notice: </span>
            {INSTITUTION_INFO.disclaimer}
          </div>
        </div>
      </div>

      {/* 2. Recently Added Resources Strip */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Recently Added 3rd Semester Resources
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            Latest uploads
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentlyAddedResources.map((res, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/80 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-bold text-blue-700">{res.tag}</span>
                  <span className="text-slate-400 font-mono text-[10px]">{res.time}</span>
                </div>
                <div className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                  {res.title}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (res.type === 'notes') onOpenNote(res.item as NoteItem);
                    else if (res.type === 'papers') onOpenPaper(res.item as QuestionPaperItem);
                    else if (res.type === 'manuals') {
                      const man = res.item as LabManualItem;
                      onOpenExperiment(man.experiments[0], man);
                    }
                  }}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => {
                    const fname =
                      (res.item as NoteItem)?.downloadFileName ||
                      (res.item as QuestionPaperItem)?.downloadFileName ||
                      (res.item as LabManualItem)?.downloadFileName;
                    handleDownload(fname);
                  }}
                  className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Search and Multi-Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Global Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, unit, formula, experiment, or paper..."
              className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter by Subject Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Subject:</span>
            <select
              value={selectedSubjectCode}
              onChange={(e) => setSelectedSubjectCode(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-semibold max-w-[260px] shadow-2xs"
            >
              <option value="ALL">All 3rd Sem Subjects</option>
              {sem3Subjects.map((sub) => (
                <option key={sub.code} value={sub.code}>
                  {sub.code} - {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter by Resource Type Pills */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-600 mr-2 whitespace-nowrap">Resource Type:</span>
            <button
              onClick={() => setSelectedResourceType('ALL')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedResourceType === 'ALL'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setSelectedResourceType('notes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedResourceType === 'notes'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span>Notes Only</span>
            </button>
            <button
              onClick={() => setSelectedResourceType('papers')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedResourceType === 'papers'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-3 h-3" />
              <span>Question Papers Only</span>
            </button>
            <button
              onClick={() => setSelectedResourceType('manuals')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedResourceType === 'manuals'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FlaskConical className="w-3 h-3" />
              <span>Lab Manuals Only</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 font-mono">
            Showing {filteredSubjectGroups.length} subjects with resources
          </div>
        </div>
      </div>

      {/* 4. Subject-by-Subject Academic Resource Organization */}
      <div className="space-y-6">
        {filteredSubjectGroups.map((group) => {
          const { subject, notes: subNotes, papers: subPapers, manuals: subManuals } = group;

          return (
            <div
              key={subject.code}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden transition-all hover:border-slate-300"
            >
              {/* Subject Title & Code Header */}
              <div className="px-6 py-5 bg-linear-to-r from-slate-50 to-blue-50/40 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200 px-2.5 py-0.5 rounded-md">
                      {subject.code}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                      Demo Syllabus
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-600 font-medium">
                      {subject.credits} Credits · {subject.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {subject.name}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Faculty Coordinator: <span className="font-semibold text-slate-700">{subject.faculty}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-center">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 shadow-2xs font-mono">
                    {subNotes.length} Notes · {subPapers.length} Papers · {subManuals.length} Labs
                  </span>
                </div>
              </div>

              {/* Subject Resources Body */}
              <div className="p-6 space-y-6">
                {/* 1. Notes Sub-section */}
                {subNotes.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wider">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      <span>Lecture Notes & Modules ({subNotes.length})</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {subNotes.map((note) => (
                        <div
                          key={note.id}
                          className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:shadow-xs transition-all space-y-3 flex flex-col justify-between"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-blue-700">Unit {note.unit}: {note.unitTitle}</span>
                              <span className="font-mono text-slate-400 text-[11px]">{note.fileSize}</span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 leading-snug">
                              {note.title}
                            </h4>
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                              {note.summary}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                            <span className="text-slate-500 text-[11px]">{note.pages} pages</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => onOpenNote(note)}
                                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold rounded-lg transition-colors flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" />
                                <span>View</span>
                              </button>
                              <button
                                onClick={() => handleDownload(note.downloadFileName)}
                                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                              >
                                <Download className="w-3 h-3" />
                                <span>Download</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Question Papers Sub-section */}
                {subPapers.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Previous Question Papers & Solutions ({subPapers.length})</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {subPapers.map((paper) => (
                        <div
                          key={paper.id}
                          className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:shadow-xs transition-all space-y-3 flex flex-col justify-between"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-emerald-700 font-mono">{paper.year} {paper.examType}</span>
                              <span className="font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                                {paper.totalMarks} Marks
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-900">
                              {paper.subjectName}
                            </h4>
                            <div className="text-xs text-slate-500">
                              Curriculum Scheme: <strong className="text-slate-700">{paper.scheme}</strong>
                            </div>
                            {paper.hasSolutions && (
                              <div className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Evaluation Scheme & Answer Key Included</span>
                              </div>
                            )}
                          </div>

                          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                            <span className="text-slate-500 font-mono text-[11px]">{paper.fileSize}</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => onOpenPaper(paper)}
                                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg transition-colors flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" />
                                <span>View</span>
                              </button>
                              <button
                                onClick={() => handleDownload(paper.downloadFileName)}
                                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                              >
                                <Download className="w-3 h-3" />
                                <span>Download</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Lab Manuals Sub-section */}
                {subManuals.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
                      <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
                      <span>Laboratory Manuals & Experiment Procedures ({subManuals.length})</span>
                    </div>

                    <div className="space-y-4">
                      {subManuals.map((man) => (
                        <div
                          key={man.id}
                          className="p-5 rounded-2xl border border-amber-200 bg-amber-50/20 space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
                            <div>
                              <div className="text-xs font-mono font-bold text-amber-900">
                                {man.courseCode} · {man.totalExperiments} Prescribed Experiments
                              </div>
                              <h4 className="text-base font-bold text-slate-900">
                                {man.courseName}
                              </h4>
                              <div className="text-xs text-slate-500">
                                Lab In-charge: <strong className="text-slate-700">{man.labIncharge}</strong>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDownload(man.downloadFileName)}
                              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download Complete Manual</span>
                            </button>
                          </div>

                          {/* List of experiments inside this manual */}
                          <div className="space-y-2">
                            <div className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                              Prescribed Experiments:
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                              {man.experiments.map((exp) => (
                                <div
                                  key={exp.number}
                                  className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-2 hover:border-amber-300 transition-colors"
                                >
                                  <div>
                                    <div className="text-[11px] font-bold text-amber-800 font-mono">
                                      Exp {exp.number}
                                    </div>
                                    <div className="text-xs font-bold text-slate-900 line-clamp-1">
                                      {exp.title}
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => onOpenExperiment(exp, man)}
                                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-lg text-xs transition-colors shrink-0 flex items-center gap-1"
                                  >
                                    <Eye className="w-3 h-3" />
                                    <span>Code & Viva</span>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* If no resources match the active filter for this subject */}
                {subNotes.length === 0 && subPapers.length === 0 && subManuals.length === 0 && (
                  <div className="py-6 text-center text-xs text-slate-500 italic">
                    No resources matching active filter for this subject.
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredSubjectGroups.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-2xs">
              <Search className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900">
                No matching 3rd-Semester resources
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We couldn't find any resources matching your search query "{searchQuery}". Try clearing search or resetting the subject filter.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSubjectCode('ALL');
                setSelectedResourceType('ALL');
              }}
              className="px-4 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
