import React, { useState, useMemo } from 'react';
import { QuestionPaperItem, Subject } from '../types';
import {
  Search,
  Download,
  Eye,
  FileText,
  CheckCircle2,
  Calendar,
  Award,
  GraduationCap,
  X,
} from 'lucide-react';
import { useToast } from './Toast';

interface QuestionPapersViewProps {
  papers: QuestionPaperItem[];
  subjects: Subject[];
  initialSemester: number;
  onOpenPaper: (paper: QuestionPaperItem) => void;
}

export const QuestionPapersView: React.FC<QuestionPapersViewProps> = ({
  papers,
  subjects,
  initialSemester,
  onOpenPaper,
}) => {
  const { showToast } = useToast();
  const [selectedSemester, setSelectedSemester] = useState<number>(initialSemester);
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const years = [2024, 2023, 2022, 2021];

  const availableSubjects = useMemo(() => {
    return subjects.filter((s) => s.semester === selectedSemester);
  }, [subjects, selectedSemester]);

  const filteredPapers = useMemo(() => {
    return papers.filter((paper) => {
      if (paper.semester !== selectedSemester) return false;
      if (selectedSubject !== 'ALL' && paper.subjectCode !== selectedSubject) return false;
      if (selectedYear !== 'ALL' && paper.year !== selectedYear) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = paper.subjectName.toLowerCase().includes(query);
        const matchesCode = paper.subjectCode.toLowerCase().includes(query);
        const matchesExamType = paper.examType.toLowerCase().includes(query);
        return matchesTitle || matchesCode || matchesExamType;
      }
      return true;
    });
  }, [papers, selectedSemester, selectedSubject, selectedYear, searchQuery]);

  const handleDownload = (paper: QuestionPaperItem) => {
    showToast(`Downloading question paper: ${paper.downloadFileName}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Examination Archive & Solution Keys</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Previous Year Question Papers
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Archive of Semester End Examination (SEE) papers, internal assessments, and official step-by-step marking rubrics across academic schemes.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search paper, course code, year..."
            className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 focus:bg-white transition-all shadow-2xs"
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

      {/* Filter Toolbar: Semester, Subject, and Exam Year */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        {/* Semester Tabs */}
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
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                Semester {sem}
              </button>
            ))}
          </div>
        </div>

        {/* Subject & Year Dropdown/Chips */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-semibold max-w-[280px] shadow-2xs"
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
            <span className="text-xs font-bold text-slate-600 mr-1 whitespace-nowrap">Exam Year:</span>
            <button
              onClick={() => setSelectedYear('ALL')}
              className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-colors whitespace-nowrap ${
                selectedYear === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Years
            </button>
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-colors whitespace-nowrap ${
                  selectedYear === y
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div>
          Found <span className="font-bold text-slate-900 font-mono">{filteredPapers.length}</span> question papers for Semester {selectedSemester}
          {selectedYear !== 'ALL' && ` · Year ${selectedYear}`}
          {selectedSubject !== 'ALL' && ` · ${selectedSubject}`}
        </div>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-emerald-600 hover:underline font-semibold"
          >
            Clear active search
          </button>
        )}
      </div>

      {/* Resource Cards Grid */}
      {filteredPapers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPapers.map((paper) => {
            const totalQuestionsCount = paper.sections.reduce((acc, s) => acc + s.questions.length, 0);

            return (
              <div
                key={paper.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono font-bold text-emerald-900 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded">
                          {paper.subjectCode}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="font-bold text-emerald-700">
                          {paper.year} {paper.examType}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-2 leading-snug">
                        {paper.subjectName}
                      </h3>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                        {paper.totalMarks} Marks
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-3">
                      <span>Curriculum: <strong className="text-slate-800 font-semibold">{paper.scheme}</strong></span>
                      <span>·</span>
                      <span>Questions: <strong className="text-slate-800 font-semibold">{totalQuestionsCount} items</strong></span>
                      <span>·</span>
                      <span className="font-mono">{paper.fileSize}</span>
                    </div>

                    {paper.hasSolutions ? (
                      <div className="flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Includes official scheme of evaluation & answers</span>
                      </div>
                    ) : (
                      <div className="text-slate-400 italic text-[11px]">
                        Standard question paper (solutions available via department library)
                      </div>
                    )}
                  </div>

                  {/* Modules Covered Preview */}
                  <div className="pt-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Paper Modules:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {paper.sections.map((sec, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium"
                        >
                          {sec.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* View/Download Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onOpenPaper(paper)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 text-xs font-bold rounded-xl transition-colors border border-emerald-200/60"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Question Paper</span>
                  </button>

                  <button
                    onClick={() => handleDownload(paper)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State Message */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs">
            <FileText className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-slate-900">
              No question papers found
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We couldn't locate examination papers matching your criteria for Semester {selectedSemester}. Try resetting your year or subject filter.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedSemester(5);
              setSelectedSubject('ALL');
              setSelectedYear('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Show Semester 5 Exam Papers
          </button>
        </div>
      )}
    </div>
  );
};
