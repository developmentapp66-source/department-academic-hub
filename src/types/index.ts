export interface StudentUser {
  usn: string;
  name: string;
  institution?: string;
  department: string;
  deptCode: string;
  semester: number;
  section: string;
  academicYear: string;
  email: string;
  avatarUrl?: string;
}

export interface Subject {
  code: string;
  name: string;
  semester: number;
  credits: number;
  faculty: string;
  category: 'Core' | 'Elective' | 'Laboratory';
}

export interface NoteItem {
  id: string;
  subjectCode: string;
  subjectName: string;
  semester: number;
  unit: number;
  unitTitle: string;
  title: string;
  topics: string[];
  author: string;
  dateUpdated: string;
  pages: number;
  fileSize: string;
  summary: string;
  contentPreview: string[];
  keyDefinitions?: { term: string; explanation: string }[];
  importantFormulasOrCode?: string[];
  downloadFileName: string;
}

export interface QuestionPaperItem {
  id: string;
  subjectCode: string;
  subjectName: string;
  semester: number;
  year: number;
  examType: 'Semester End (SEE)' | 'Internal Assessment 1' | 'Internal Assessment 2' | 'Model Question Paper';
  scheme: string;
  totalMarks: number;
  fileSize: string;
  hasSolutions: boolean;
  sections: {
    title: string;
    questions: {
      qNum: string;
      text: string;
      marks: number;
      module: string;
    }[];
  }[];
  downloadFileName: string;
}

export interface LabExperiment {
  number: number;
  title: string;
  objective: string;
  prerequisites: string;
  algorithmSteps: string[];
  sampleCodeSnippet?: string;
  codeLanguage?: string;
  expectedOutput?: string;
  vivaQuestions: { question: string; answer: string }[];
}

export interface LabManualItem {
  id: string;
  courseCode: string;
  courseName: string;
  semester: number;
  labIncharge: string;
  totalExperiments: number;
  fileSize: string;
  softwareRequired: string[];
  objectives: string[];
  experiments: LabExperiment[];
  downloadFileName: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  category: 'Examinations' | 'Lab Timetable' | 'Circular' | 'Guest Lecture' | 'Project Review';
  date: string;
  author: string;
  priority: 'high' | 'normal';
  content: string;
  attachmentName?: string;
  pinned: boolean;
}

export type RecentlyAddedItem =
  | { type: 'note'; item: NoteItem; addedDate: string; category: string }
  | { type: 'paper'; item: QuestionPaperItem; addedDate: string; category: string }
  | { type: 'manual'; item: LabManualItem; addedDate: string; category: string };
