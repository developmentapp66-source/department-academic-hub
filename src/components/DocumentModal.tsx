import React, { useState } from 'react';
import { X, Download, Printer, BookOpen, FileText, FlaskConical, Check, Copy, AlertCircle } from 'lucide-react';
import { NoteItem, QuestionPaperItem, LabExperiment, LabManualItem } from '../types';
import { useToast } from './Toast';

type ModalDoc =
  | { type: 'note'; data: NoteItem }
  | { type: 'paper'; data: QuestionPaperItem }
  | { type: 'experiment'; data: LabExperiment; manual: LabManualItem }
  | null;

interface DocumentModalProps {
  document: ModalDoc;
  onClose: () => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({ document, onClose }) => {
  const { showToast } = useToast();
  const [copiedCode, setCopiedCode] = useState(false);

  if (!document) return null;

  const handleDownload = (filename: string) => {
    showToast(`Downloading "${filename}"... (Simulation)`, 'success');
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    showToast('Code copied to clipboard', 'info');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-3xl max-h-[90vh] flex flex-col rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
              {document.type === 'note' && <BookOpen className="w-5 h-5 text-indigo-600" />}
              {document.type === 'paper' && <FileText className="w-5 h-5 text-emerald-600" />}
              {document.type === 'experiment' && <FlaskConical className="w-5 h-5 text-amber-600" />}
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium tracking-wide uppercase">
                {document.type === 'note' && `Semester ${document.data.semester} · ${document.data.subjectCode}`}
                {document.type === 'paper' && `${document.data.year} ${document.data.examType} · ${document.data.scheme}`}
                {document.type === 'experiment' && `${document.manual.courseCode} · Experiment ${document.data.number}`}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-1">
                {document.type === 'note' && document.data.title}
                {document.type === 'paper' && `${document.data.subjectName} (${document.data.subjectCode})`}
                {document.type === 'experiment' && document.data.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="Print document"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (document.type === 'note') handleDownload(document.data.downloadFileName);
                else if (document.type === 'paper') handleDownload(document.data.downloadFileName);
                else if (document.type === 'experiment') handleDownload(document.manual.downloadFileName);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-800">
          {/* 1. NOTE PREVIEW */}
          {document.type === 'note' && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 mb-2">
                  <span>Unit {document.data.unit}: {document.data.unitTitle}</span>
                  <span>Author: {document.data.author}</span>
                  <span>{document.data.pages} Pages · {document.data.fileSize}</span>
                </div>
                <p className="text-sm text-slate-700">{document.data.summary}</p>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Key Topics Covered
                </h4>
                <div className="flex flex-wrap gap-2">
                  {document.data.topics.map((t, idx) => (
                    <span key={idx} className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                  Lecture Concepts & Detailed Summary
                </h4>
                <div className="space-y-3">
                  {document.data.contentPreview.map((para, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg border border-slate-100 bg-white shadow-2xs text-sm leading-relaxed text-slate-800">
                      {para}
                    </div>
                  ))}
                </div>
              </div>

              {document.data.keyDefinitions && document.data.keyDefinitions.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Key Definitions
                  </h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {document.data.keyDefinitions.map((d, i) => (
                      <div key={i} className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg">
                        <div className="font-semibold text-xs text-indigo-900 mb-1">{d.term}</div>
                        <div className="text-xs text-indigo-800/90 leading-relaxed">{d.explanation}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {document.data.importantFormulasOrCode && document.data.importantFormulasOrCode.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Key Formulas / Reference Rules
                  </h4>
                  <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-lg space-y-1.5 overflow-x-auto">
                    {document.data.importantFormulasOrCode.map((rule, idx) => (
                      <div key={idx}>» {rule}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. QUESTION PAPER PREVIEW */}
          {document.type === 'paper' && (
            <div className="space-y-6">
              {/* Exam Header Sheet */}
              <div className="text-center border-b border-slate-300 pb-5">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Department Examination Cell · Semester End Exam
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {document.data.subjectName}
                </h3>
                <div className="flex items-center justify-center gap-4 text-xs text-slate-600 mt-2 font-mono">
                  <span>Course Code: {document.data.subjectCode}</span>
                  <span>·</span>
                  <span>Time: 3 Hours</span>
                  <span>·</span>
                  <span>Max Marks: {document.data.totalMarks}</span>
                </div>
                <div className="text-xs text-slate-500 italic mt-2">
                  Note: Answer any FIVE full questions, choosing at least ONE question from each module.
                </div>
              </div>

              {/* Modules & Questions */}
              <div className="space-y-6">
                {document.data.sections.map((sec, sIdx) => (
                  <div key={sIdx} className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center justify-between">
                      <span>{sec.title}</span>
                    </div>

                    <div className="space-y-2">
                      {sec.questions.map((q, qIdx) => (
                        <div
                          key={qIdx}
                          className="flex items-start justify-between gap-4 p-3 bg-slate-50/70 border border-slate-200 rounded-lg text-sm"
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="font-semibold text-slate-900 text-xs shrink-0 font-mono">
                              {q.qNum}
                            </span>
                            <span className="text-slate-800 leading-relaxed">{q.text}</span>
                          </div>
                          <div className="text-xs font-mono font-semibold text-slate-600 shrink-0 bg-white px-2 py-0.5 rounded border border-slate-200">
                            [{q.marks}M]
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {document.data.hasSolutions && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Model answer key and step-by-step scheme of evaluation are attached with this PDF download.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 3. LAB EXPERIMENT PREVIEW */}
          {document.type === 'experiment' && (
            <div className="space-y-6">
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-lg">
                <div className="text-xs font-bold uppercase text-amber-900 mb-1">
                  Objective & Scope
                </div>
                <p className="text-sm text-amber-950 leading-relaxed">
                  {document.data.objective}
                </p>
                <div className="text-xs text-amber-800 mt-2">
                  <span className="font-semibold">Prerequisites:</span> {document.data.prerequisites}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Procedure & Algorithm Steps
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-sm text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  {document.data.algorithmSteps.map((step, idx) => (
                    <li key={idx} className="leading-relaxed pl-1">{step}</li>
                  ))}
                </ol>
              </div>

              {document.data.sampleCodeSnippet && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Implementation / Code ({document.data.codeLanguage || 'Code'})
                    </h4>
                    <button
                      onClick={() => handleCopyCode(document.data.sampleCodeSnippet || '')}
                      className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 bg-slate-950 text-slate-100 rounded-lg font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                    {document.data.sampleCodeSnippet}
                  </pre>
                </div>
              )}

              {document.data.expectedOutput && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Sample Terminal / Execution Output
                  </h4>
                  <pre className="p-3 bg-slate-900 text-emerald-400 rounded-lg font-mono text-xs overflow-x-auto border border-slate-800">
                    {document.data.expectedOutput}
                  </pre>
                </div>
              )}

              {document.data.vivaQuestions && document.data.vivaQuestions.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Viva-Voce Practice Questions
                  </h4>
                  <div className="space-y-2">
                    {document.data.vivaQuestions.map((viva, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="text-xs font-semibold text-slate-900">
                          Q{idx + 1}: {viva.question}
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          Ans: {viva.answer}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-slate-50/50">
          <div className="text-xs text-slate-500">
            Official Resource · Department Academic Repository
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
