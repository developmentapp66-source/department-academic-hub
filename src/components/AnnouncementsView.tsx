import React, { useState, useMemo } from 'react';
import { AnnouncementItem } from '../types';
import {
  Bell,
  Pin,
  Download,
  Calendar,
  Search,
  AlertCircle,
  FileText,
  CheckCircle2,
  Building2,
  X,
} from 'lucide-react';
import { useToast } from './Toast';

interface AnnouncementsViewProps {
  announcements: AnnouncementItem[];
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({ announcements }) => {
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['ALL', 'Examinations', 'Lab Timetable', 'Circular', 'Guest Lecture', 'Project Review'];

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((item) => {
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query) ||
          item.author.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [announcements, selectedCategory, searchQuery]);

  const handleDownloadAttachment = (filename: string) => {
    showToast(`Downloading notice attachment: ${filename}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
            <Bell className="w-3.5 h-3.5" />
            <span>Official University Notice Board</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Announcements & Administrative Circulars
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Semester End Exam schedules, laboratory continuous assessment notices, guest seminars, and major project evaluation dates.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search circulars, exams, reviews..."
            className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-600 focus:border-rose-600 focus:bg-white transition-all shadow-2xs"
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

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-slate-500 mr-2 ml-1 whitespace-nowrap">Filter:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-500/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat === 'ALL' ? 'All Notices' : cat}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl border p-6 sm:p-7 shadow-xs transition-all space-y-4 ${
              item.pinned
                ? 'border-blue-300 bg-linear-to-r from-white via-white to-blue-50/30'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                {item.pinned && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                    <Pin className="w-3 h-3" />
                    Pinned
                  </span>
                )}
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                  {item.category}
                </span>
                {item.priority === 'high' && (
                  <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-200">
                    High Priority
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.date}</span>
                </div>
                <span>·</span>
                <span className="font-sans font-medium text-slate-700">{item.author}</span>
              </div>
            </div>

            {/* Title & Content */}
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {item.title}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {item.content}
              </p>
            </div>

            {/* Attachment Download Action */}
            {item.attachmentName && (
              <div className="pt-2">
                <button
                  onClick={() => handleDownloadAttachment(item.attachmentName || '')}
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200 shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-600" />
                  <span>Gazetted Document: <span className="font-mono text-blue-700">{item.attachmentName}</span></span>
                  <Download className="w-3 h-3 text-slate-500 ml-1" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
