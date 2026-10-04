import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { StudentUser, AdminResourceItem, AnnouncementItem } from '../types';

// Read client-side environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

// Determine if valid Supabase configuration is present
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project-ref')
);

// Fallback placeholder client to prevent runtime crashes if env vars are missing
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured ? supabaseUrl! : 'https://placeholder-project.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey! : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

/**
 * Internally derives a standardized institutional email from the student or admin USN/ID.
 * e.g. "1SI23CH015" -> "1si23ch015@sit.ac.in"
 */
export function deriveEmailFromUsn(usn: string): string {
  const cleanUsn = usn.trim().replace(/\s+/g, '').toLowerCase();
  if (cleanUsn.includes('@')) {
    return cleanUsn;
  }
  return `${cleanUsn}@sit.ac.in`;
}

/**
 * Validates with the database if the given user or user ID has active admin privileges.
 * Resilient to lookup by user ID or user email with case-insensitive role check.
 */
export async function checkIsAdmin(userOrId: string | User): Promise<boolean> {
  if (!isSupabaseConfigured || !userOrId) return false;

  try {
    const userId = typeof userOrId === 'string' ? userOrId : userOrId.id;
    let userEmail: string | undefined = typeof userOrId === 'object' ? userOrId.email : undefined;

    // Check app_metadata or user_metadata if User object was provided
    if (typeof userOrId === 'object') {
      const u = userOrId as User;
      const metaRole = (u.app_metadata?.role || u.user_metadata?.role)?.toLowerCase();
      if (metaRole === 'faculty_admin' || metaRole === 'super_admin') {
        return true;
      }
    }

    // If only userId was passed, get user email to allow fallback search by email
    if (!userEmail) {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user && authData.user.id === userId) {
        userEmail = authData.user.email;
        const metaRole = (authData.user.app_metadata?.role || authData.user.user_metadata?.role)?.toLowerCase();
        if (metaRole === 'faculty_admin' || metaRole === 'super_admin') {
          return true;
        }
      }
    }

    // 1. Try to query student_profiles by ID
    const { data: byId } = await supabase
      .from('student_profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle();

    if (byId?.role) {
      const r = byId.role.toLowerCase();
      if (r === 'faculty_admin' || r === 'super_admin') return true;
    }

    // 2. Fallback: Query student_profiles by Email
    if (userEmail) {
      const { data: byEmail } = await supabase
        .from('student_profiles')
        .select('role')
        .eq('email', userEmail)
        .maybeSingle();

      if (byEmail?.role) {
        const r = byEmail.role.toLowerCase();
        if (r === 'faculty_admin' || r === 'super_admin') return true;
      }
    }

    return false;
  } catch (err) {
    console.error('Error verifying admin authorization:', err);
    return false;
  }
}

/**
 * Fetches the student or admin profile from the `student_profiles` table.
 * If not present, creates/upserts the initial profile with SIT Chemical Engineering 3rd Sem defaults.
 */
export async function getOrSyncStudentProfile(user: User, fallbackUsn?: string): Promise<StudentUser> {
  const metadata = user.user_metadata || {};
  const appMeta = user.app_metadata || {};

  // Extract clean USN
  let usn = (metadata.usn || fallbackUsn || '').trim().toUpperCase();
  if (!usn && user.email) {
    const match = user.email.match(/([0-9][a-zA-Z]{2}[0-9]{2}[a-zA-Z]{2}[0-9]{1,3})/i);
    if (match) {
      usn = match[1].toUpperCase();
    } else {
      usn = user.email.split('@')[0].toUpperCase();
    }
  }
  if (!usn) {
    usn = '1SI23CH015';
  }

  const initialRole = (metadata.role || appMeta.role || 'student').toLowerCase();

  const defaultProfile: StudentUser = {
    usn,
    name: metadata.full_name || metadata.name || `Student (${usn})`,
    institution: 'Siddaganga Institute of Technology, Tumakuru',
    department: 'Chemical Engineering',
    deptCode: 'CH',
    semester: typeof metadata.semester === 'number' ? metadata.semester : Number(metadata.semester) || 3,
    section: metadata.section || 'A',
    academicYear: metadata.academic_year || '2024–2025',
    email: user.email || deriveEmailFromUsn(usn),
    supabaseId: user.id,
    role: initialRole as any,
    createdAt: user.created_at || new Date().toISOString(),
  };

  if (!isSupabaseConfigured) {
    return defaultProfile;
  }

  try {
    let profileRow: any = null;

    // 1a. Try to fetch existing row from student_profiles table by id
    const { data: byId, error: errId } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (byId && !errId) {
      profileRow = byId;
    } else if (user.email) {
      // 1b. Fallback: Try to fetch by email if id didn't match directly
      const { data: byEmail, error: errEmail } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();

      if (byEmail && !errEmail) {
        profileRow = byEmail;
      }
    }

    if (profileRow) {
      const resolvedRole = (profileRow.role || initialRole || 'student').toLowerCase();
      return {
        usn: profileRow.usn || defaultProfile.usn,
        name: profileRow.full_name || defaultProfile.name,
        institution: profileRow.institution || defaultProfile.institution,
        department: profileRow.department || defaultProfile.department,
        deptCode: profileRow.dept_code || defaultProfile.deptCode,
        semester: Number(profileRow.semester) || 3,
        section: profileRow.section || defaultProfile.section,
        academicYear: profileRow.academic_year || defaultProfile.academicYear,
        email: profileRow.email || user.email || defaultProfile.email,
        supabaseId: user.id,
        role: resolvedRole as any,
        createdAt: profileRow.created_at || defaultProfile.createdAt,
      };
    }

    // 2. If row not found, attempt to insert initial student profile record
    const { data: insertedData, error: insertError } = await supabase
      .from('student_profiles')
      .upsert(
        {
          id: user.id,
          usn: defaultProfile.usn,
          full_name: defaultProfile.name,
          institution: defaultProfile.institution,
          department: defaultProfile.department,
          dept_code: defaultProfile.deptCode,
          semester: defaultProfile.semester,
          section: defaultProfile.section,
          academic_year: defaultProfile.academicYear,
          email: defaultProfile.email,
          role: defaultProfile.role || 'student',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select()
      .maybeSingle();

    if (insertedData && !insertError) {
      const resolvedRole = (insertedData.role || defaultProfile.role || 'student').toLowerCase();
      return {
        usn: insertedData.usn || defaultProfile.usn,
        name: insertedData.full_name || defaultProfile.name,
        institution: insertedData.institution || defaultProfile.institution,
        department: insertedData.department || defaultProfile.department,
        deptCode: insertedData.dept_code || defaultProfile.deptCode,
        semester: Number(insertedData.semester) || 3,
        section: insertedData.section || defaultProfile.section,
        academicYear: insertedData.academic_year || defaultProfile.academicYear,
        email: insertedData.email || defaultProfile.email,
        supabaseId: user.id,
        role: resolvedRole as any,
        createdAt: insertedData.created_at || defaultProfile.createdAt,
      };
    }
  } catch (err) {
    console.warn('Could not sync with student_profiles table, using auth metadata:', err);
  }

  return defaultProfile;
}

/**
 * Synchronous mapper for fallback user objects.
 */
export function mapSupabaseUserToStudent(user: User): StudentUser {
  const metadata = user.user_metadata || {};

  let derivedUsn = metadata.usn;
  if (!derivedUsn && user.email) {
    const match = user.email.match(/([0-9][a-zA-Z]{2}[0-9]{2}[a-zA-Z]{2}[0-9]{1,3})/i);
    if (match) {
      derivedUsn = match[1].toUpperCase();
    } else {
      derivedUsn = user.email.split('@')[0].toUpperCase();
    }
  }

  return {
    usn: (derivedUsn || '1SI23CH015').toUpperCase(),
    name: metadata.full_name || metadata.name || user.email?.split('@')[0] || 'SIT Student',
    institution: metadata.institution || 'Siddaganga Institute of Technology, Tumakuru',
    department: metadata.department || 'Chemical Engineering',
    deptCode: metadata.dept_code || 'CH',
    semester: typeof metadata.semester === 'number' ? metadata.semester : Number(metadata.semester) || 3,
    section: metadata.section || 'A',
    academicYear: metadata.academic_year || '2024–2025',
    email: user.email || '',
    supabaseId: user.id,
    role: metadata.role || 'student',
    createdAt: user.created_at || new Date().toISOString(),
  };
}

/**
 * Fetches all registered student profiles. (Guarded by Supabase RLS: only admins can select all rows).
 * Never exposes passwords or sensitive credentials.
 */
export async function fetchRegisteredStudents(): Promise<StudentUser[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('student_profiles')
    .select('id, usn, full_name, institution, department, dept_code, semester, section, academic_year, email, role, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map((row) => ({
    usn: row.usn,
    name: row.full_name,
    institution: row.institution,
    department: row.department,
    deptCode: row.dept_code,
    semester: Number(row.semester),
    section: row.section,
    academicYear: row.academic_year,
    email: row.email,
    supabaseId: row.id,
    role: row.role,
    createdAt: row.created_at,
  }));
}

/**
 * Fetches all managed academic resources.
 */
export async function fetchAdminResources(): Promise<AdminResourceItem[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('academic_resources')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Could not fetch academic_resources from database table:', error.message);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    title: row.title,
    subjectCode: row.subject_code,
    subjectName: row.subject_name,
    semester: Number(row.semester),
    resourceType: row.resource_type,
    description: row.description || '',
    fileLink: row.file_link,
    fileSize: row.file_size || '2.5 MB',
    authorOrFaculty: row.author_faculty || '',
    dateAdded: row.date_added || row.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
  }));
}

/**
 * Inserts a new academic resource. Guarded by RLS: requires is_admin() privilege.
 */
export async function insertAdminResource(resource: Omit<AdminResourceItem, 'id' | 'dateAdded'>): Promise<AdminResourceItem> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase
    .from('academic_resources')
    .insert([
      {
        title: resource.title,
        subject_code: resource.subjectCode,
        subject_name: resource.subjectName,
        semester: resource.semester,
        resource_type: resource.resourceType,
        description: resource.description,
        file_link: resource.fileLink,
        file_size: resource.fileSize || '2.5 MB',
        author_faculty: resource.authorOrFaculty || '',
        date_added: new Date().toISOString().split('T')[0],
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    title: data.title,
    subjectCode: data.subject_code,
    subjectName: data.subject_name,
    semester: Number(data.semester),
    resourceType: data.resource_type,
    description: data.description || '',
    fileLink: data.file_link,
    fileSize: data.file_size || '2.5 MB',
    authorOrFaculty: data.author_faculty || '',
    dateAdded: data.date_added,
  };
}

/**
 * Updates an academic resource. Guarded by RLS: requires is_admin() privilege.
 */
export async function updateAdminResource(id: string, updates: Partial<AdminResourceItem>): Promise<void> {
  if (!isSupabaseConfigured) return;

  const dbUpdates: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.subjectCode !== undefined) dbUpdates.subject_code = updates.subjectCode;
  if (updates.subjectName !== undefined) dbUpdates.subject_name = updates.subjectName;
  if (updates.semester !== undefined) dbUpdates.semester = updates.semester;
  if (updates.resourceType !== undefined) dbUpdates.resource_type = updates.resourceType;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.fileLink !== undefined) dbUpdates.file_link = updates.fileLink;
  if (updates.fileSize !== undefined) dbUpdates.file_size = updates.fileSize;
  if (updates.authorOrFaculty !== undefined) dbUpdates.author_faculty = updates.authorOrFaculty;

  const { error } = await supabase
    .from('academic_resources')
    .update(dbUpdates)
    .eq('id', id);

  if (error) throw error;
}

/**
 * Deletes an academic resource. Guarded by RLS: requires is_admin() privilege.
 */
export async function deleteAdminResource(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from('academic_resources')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Fetches announcements from the database.
 */
export async function fetchDbAnnouncements(): Promise<AnnouncementItem[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('department_announcements')
    .select('*')
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Could not fetch department_announcements from DB:', error.message);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category as any,
    date: row.date || row.created_at?.split('T')[0],
    author: row.author,
    priority: row.priority as any,
    content: row.content,
    attachmentName: row.attachment_name,
    pinned: Boolean(row.pinned),
  }));
}

/**
 * Inserts an announcement into the database. Guarded by RLS: requires is_admin() privilege.
 */
export async function insertDbAnnouncement(ann: Omit<AnnouncementItem, 'id' | 'date'>): Promise<AnnouncementItem> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase
    .from('department_announcements')
    .insert([
      {
        title: ann.title,
        category: ann.category,
        priority: ann.priority,
        content: ann.content,
        author: ann.author,
        attachment_name: ann.attachmentName || null,
        pinned: ann.pinned || false,
        date: new Date().toISOString().split('T')[0],
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    title: data.title,
    category: data.category as any,
    date: data.date,
    author: data.author,
    priority: data.priority as any,
    content: data.content,
    attachmentName: data.attachment_name,
    pinned: Boolean(data.pinned),
  };
}

/**
 * Updates an announcement in the database. Guarded by RLS: requires is_admin() privilege.
 */
export async function updateDbAnnouncement(id: string, updates: Partial<AnnouncementItem>): Promise<void> {
  if (!isSupabaseConfigured) return;

  const dbUpdates: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
  if (updates.content !== undefined) dbUpdates.content = updates.content;
  if (updates.author !== undefined) dbUpdates.author = updates.author;
  if (updates.attachmentName !== undefined) dbUpdates.attachment_name = updates.attachmentName;
  if (updates.pinned !== undefined) dbUpdates.pinned = updates.pinned;

  const { error } = await supabase
    .from('department_announcements')
    .update(dbUpdates)
    .eq('id', id);

  if (error) throw error;
}

/**
 * Deletes an announcement from the database. Guarded by RLS: requires is_admin() privilege.
 */
export async function deleteDbAnnouncement(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from('department_announcements')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
