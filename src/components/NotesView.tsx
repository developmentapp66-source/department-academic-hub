import React, { useState, useMemo } from 'react';
import { NoteItem, Subject } from '../types';
import {
  Search,
  Download,
  Eye,
  BookOpen,
  Bookmark,
  Filter,
  FileText,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { useToast } from './Toast';

interface NotesViewProps {
  notes: NoteItem[];
  subjects: Subject[];
  initialSemester: number;
  onOpenNote: (note: NoteItem) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  subjects,
  initialSemester,
  onOpenNote,
}) => {
  const { showToast } = useToast();
  const [selectedSemester, setSelectedSemester] = useState<number>(initialSemester);
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedUnit, setSelectedUnit] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set(['note-501']));

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const units = [1, 2, 3, 4, 5];

  // Subjects for the active semester
  const availableSubjects = useMemo(() => {
    return subjects.filter((s) => s.semester === selectedSemester);
  }, [subjects, selectedSemester]);

  // Filtered notes
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      if (note.semester !== selectedSemester) return false;
      if (selectedSubject !== 'ALL' && note.subjectCode !== selectedSubject) return false;
      if (selectedUnit !== 'ALL' && note.unit !== selectedUnit) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = note.title.toLowerCase().includes(query);
        const matchesSubject = note.subjectName.toLowerCase().includes(query) || note.subjectCode.toLowerCase().includes(query);
        const matchesUnit = note.unitTitle.toLowerCase().includes(query);
        const matchesAuthor = note.author.toLowerCase().includes(query);
        const matchesTopics = note.topics.some((t) => t.toLowerCase().includes(query));
        return matchesTitle || matchesSubject || matchesUnit || matchesAuthor || matchesTopics;
      }
      return true;
    });
  }, [notes, selectedSemester, selectedSubject, selectedUnit, searchQuery]);

  const toggleBookmark = (id: string, title: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast('Removed note from saved bookmarks', 'info');
      } else {
        next.add(id);
        showToast(`Saved "${title.slice(0, 28)}..." to bookmarks`, 'success');
      }
      return next;
    });
  };

  const handleDownload = (note: NoteItem) => {
    showToast(`Downloading: ${note.downloadFileName}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Curriculum Repository</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Lecture Notes & Syllabus Modules
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Faculty-prepared notes containing theory explanations, step-by-step mathematical derivations, architectural diagrams, and review questions.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics, course code, faculty..."
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
      </div>

      {/* Filter Toolbar: Semester, Subject & Unit */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        {/* Semester Filter Tabs */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Filter by Semester
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {semesters.map((sem) => (
              <button
                key={sem}
                onClick={() => {
                  setSelectedSemester(sem);
                  setSelectedSubject('ALL');
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                  selectedSemester === sem
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                Semester {sem}
              </button>
            ))}
          </div>
        </div>

        {/* Subject & Unit Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-semibold max-w-[280px] shadow-2xs"
            >
              <option value="ALL">All Subjects (Sem {selectedSemester})</option>
              {availableSubjects.map((sub) => (
                <option key={sub.code} value={sub.code}>
                  {sub.code} - {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-600 mr-1 whitespace-nowrap">Unit:</span>
            <button
              onClick={() => setSelectedUnit('ALL')}
              className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-colors whitespace-nowrap ${
                selectedUnit === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Units
            </button>
            {units.map((u) => (
              <button
                key={u}
                onClick={() => setSelectedUnit(u)}
                className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-colors whitespace-nowrap ${
                  selectedUnit === u
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Unit {u}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result Indicator Header */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div>
          Displaying <span className="font-bold text-slate-900 font-mono">{filteredNotes.length}</span> verified note sets for Semester {selectedSemester}
          {selectedSubject !== 'ALL' && ` · ${selectedSubject}`}
          {selectedUnit !== 'ALL' && ` · Unit ${selectedUnit}`}
        </div>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-blue-600 hover:underline font-semibold"
          >
            Clear active search
          </button>
        )}
      </div>

      {/* Resource Cards Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNotes.map((note) => {
            const isBookmarked = bookmarkedIds.has(note.id);
            return (
              <div
                key={note.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Subject and Unit */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono font-bold text-blue-900 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
                          {note.subjectCode}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="font-bold text-blue-700">
                          Unit {note.unit}: {note.unitTitle}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-2 leading-snug">
                        {note.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => toggleBookmark(note.id, note.title)}
                      className="p-2 text-slate-400 hover:text-blue-600 rounded-xl hover:bg-slate-50 transition-colors shrink-0"
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark note'}
                      aria-label="Toggle note bookmark"
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-blue-600 text-blue-600' : ''}`} />
                    </button>
                  </div>

                  {/* Note Summary */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {note.summary}
                  </p>

                  {/* Topics Covered */}
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Topics in this module:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {note.topics.slice(0, 4).map((topic, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium"
                        >
                          {topic}
                        </span>
                      ))}
                      {note.topics.length > 4 && (
                        <span className="text-[11px] px-1.5 py-0.5 text-slate-400 font-medium">
                          +{note.topics.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Metadata & View/Download Buttons */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Faculty: <strong className="text-slate-800 font-semibold">{note.author}</strong></span>
                    <span className="font-mono">{note.pages} pages · {note.fileSize}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onOpenNote(note)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-50 hover:bg-blue-100/80 text-blue-800 text-xs font-bold rounded-xl transition-colors border border-blue-200/60"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Note Preview</span>
                    </button>

                    <button
                      onClick={() => handleDownload(note)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State Message */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-2xs">
            <BookOpen className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-slate-900">
              No lecture notes match your filter
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We couldn't find any note packages for Semester {selectedSemester} matching your search or unit selection. Try resetting filters or switching to Semester {initialSemester}.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedSemester(initialSemester);
              setSelectedSubject('ALL');
              setSelectedUnit('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
