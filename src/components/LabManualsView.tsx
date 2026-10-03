import React, { useState, useMemo } from 'react';
import { LabManualItem, LabExperiment } from '../types';
import {
  FlaskConical,
  Download,
  Eye,
  Terminal,
  Code,
  CheckCircle,
  Copy,
  Check,
  ChevronRight,
  Layers,
  Search,
  X,
} from 'lucide-react';
import { useToast } from './Toast';

interface LabManualsViewProps {
  manuals: LabManualItem[];
  initialSemester: number;
  onOpenExperiment: (experiment: LabExperiment, manual: LabManualItem) => void;
}

export const LabManualsView: React.FC<LabManualsViewProps> = ({
  manuals,
  initialSemester,
  onOpenExperiment,
}) => {
  const { showToast } = useToast();
  const [selectedSemester, setSelectedSemester] = useState<number>(initialSemester);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const availableManuals = useMemo(() => {
    return manuals.filter((m) => m.semester === selectedSemester);
  }, [manuals, selectedSemester]);

  // Selected manual within the active semester
  const [selectedManualId, setSelectedManualId] = useState<string>(
    availableManuals[0]?.id || manuals[0]?.id || ''
  );

  React.useEffect(() => {
    if (availableManuals.length > 0) {
      setSelectedManualId(availableManuals[0].id);
    }
  }, [selectedSemester, availableManuals]);

  const activeManual = useMemo(() => {
    return manuals.find((m) => m.id === selectedManualId) || availableManuals[0] || manuals[0];
  }, [manuals, selectedManualId, availableManuals]);

  // Filter experiments inside active manual by search query
  const filteredExperiments = useMemo(() => {
    if (!activeManual) return [];
    if (!searchQuery.trim()) return activeManual.experiments;
    const query = searchQuery.toLowerCase();
    return activeManual.experiments.filter((exp) => {
      const matchTitle = exp.title.toLowerCase().includes(query);
      const matchObj = exp.objective.toLowerCase().includes(query);
      const matchSteps = exp.algorithmSteps.some((s) => s.toLowerCase().includes(query));
      return matchTitle || matchObj || matchSteps;
    });
  }, [activeManual, searchQuery]);

  const handleDownloadFull = (manual: LabManualItem) => {
    showToast(`Downloading full manual: ${manual.downloadFileName}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Practical Curriculum & Laboratory Guides</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Laboratory Manuals & Code Repository
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Detailed procedural algorithms, runnable source code implementations, sample test cases, and oral viva-voce practice questions.
          </p>
        </div>

        {activeManual && activeManual.semester === selectedSemester && (
          <button
            onClick={() => handleDownloadFull(activeManual)}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download Full Manual (PDF)</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar: Semester & Lab Course */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        {/* Semester Filter */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Filter by Semester
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {semesters.map((sem) => (
              <button
                key={sem}
                onClick={() => setSelectedSemester(sem)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                  selectedSemester === sem
                    ? 'bg-amber-600 text-white shadow-sm shadow-amber-500/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                Semester {sem}
              </button>
            ))}
          </div>
        </div>

        {/* Lab Course Selectors & Experiment Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-slate-100">
          {availableManuals.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-600 self-center mr-1">Lab Course:</span>
              {availableManuals.map((man) => (
                <button
                  key={man.id}
                  onClick={() => setSelectedManualId(man.id)}
                  className={`px-3 py-2 text-xs rounded-xl transition-colors flex items-center gap-2 font-medium ${
                    activeManual?.id === man.id
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold shadow-2xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <FlaskConical className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>{man.courseCode}: {man.courseName}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-500 italic">No lab courses scheduled for Semester {selectedSemester}</div>
          )}

          {/* Search within experiments */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search experiments..."
              className="w-full pl-8 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-600 focus:bg-white transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Lab Manual Details & Experiments List */}
      {activeManual && activeManual.semester === selectedSemester ? (
        <div className="space-y-6">
          {/* Lab Course Overview Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200/80 px-2 py-0.5 rounded">
                    {activeManual.courseCode}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-600 font-medium">
                    Semester {activeManual.semester} Practical Laboratory
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  {activeManual.courseName}
                </h2>
              </div>
              <div className="text-xs text-slate-500 sm:text-right">
                <div>Faculty In-charge: <strong className="text-slate-800 font-semibold">{activeManual.labIncharge}</strong></div>
                <div className="font-mono text-[11px] text-slate-400 mt-0.5">
                  {activeManual.totalExperiments} Experiments Prescribed · {activeManual.fileSize}
                </div>
              </div>
            </div>

            {/* Environment & Objectives */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-slate-600" />
                  Software / Tool Environment
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeManual.softwareRequired.map((soft, i) => (
                    <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 font-mono text-[11px]">
                      {soft}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-600" />
                  Laboratory Learning Objectives
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-600 leading-relaxed text-[11px]">
                  {activeManual.objectives.map((obj, i) => (
                    <li key={i} className="line-clamp-2">{obj}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Experiments Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Laboratory Experiments ({filteredExperiments.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Select an experiment to view complete source code, procedure steps, and oral exam viva Q&A
                </p>
              </div>
            </div>

            {filteredExperiments.length > 0 ? (
              <div className="space-y-4">
                {filteredExperiments.map((exp) => (
                  <div
                    key={exp.number}
                    className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-amber-300 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80">
                            Experiment {exp.number}
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="text-xs text-slate-500">
                            Prerequisite: {exp.prerequisites}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">
                          {exp.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {exp.objective}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pt-1">
                        <button
                          onClick={() => onOpenExperiment(exp, activeManual)}
                          className="flex items-center gap-1.5 py-2 px-3.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Code & Viva</span>
                        </button>
                      </div>
                    </div>

                    {/* Procedure Highlights */}
                    <div className="pt-2 border-t border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Procedure Steps:
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
                        {exp.algorithmSteps.map((step, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <span className="font-mono text-slate-400 font-bold shrink-0">{sIdx + 1}.</span>
                            <span className="line-clamp-2 leading-relaxed">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Code Snippet Preview Container */}
                    {exp.sampleCodeSnippet && (
                      <div className="p-3.5 bg-slate-950 text-slate-300 rounded-xl font-mono text-[11px] overflow-hidden max-h-24 relative border border-slate-800">
                        <div className="absolute top-2 right-2 text-[10px] text-slate-400 uppercase tracking-widest font-sans bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {exp.codeLanguage || 'Source'}
                        </div>
                        <pre className="opacity-80">
                          {exp.sampleCodeSnippet.split('\n').slice(0, 4).join('\n')}
                        </pre>
                        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-950 to-transparent flex items-end justify-center pb-1">
                          <button
                            onClick={() => onOpenExperiment(exp, activeManual)}
                            className="text-[11px] text-amber-400 hover:underline font-sans font-semibold"
                          >
                            Click to expand full code implementation & terminal output →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
                No experiments matching "{searchQuery}".
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-2xs">
            <FlaskConical className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-slate-900">
              No lab manuals uploaded for Semester {selectedSemester}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Laboratory courses are currently active for Semester 4 and Semester 5. Switch to Semester 5 to view DBMS and Computer Networks experiment code.
            </p>
          </div>
          <button
            onClick={() => setSelectedSemester(5)}
            className="px-4 py-2.5 bg-amber-600 text-white text-xs font-bold rounded-xl hover:bg-amber-700 transition-colors shadow-sm"
          >
            Switch to Semester 5 Labs
          </button>
        </div>
      )}
    </div>
  );
};
