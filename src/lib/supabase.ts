import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { StudentUser } from '../types';

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
 * Internally derives a standardized institutional email from the student's USN.
 * e.g. "1SI23CH015" -> "1si23ch015@sit.ac.in"
 */
export function deriveEmailFromUsn(usn: string): string {
  const cleanUsn = usn.trim().replace(/\s+/g, '').toLowerCase();
  return `${cleanUsn}@sit.ac.in`;
}

/**
 * Fetches the student's profile from the `student_profiles` table.
 * If not present, creates/upserts the initial profile with SIT Chemical Engineering 3rd Sem defaults.
 */
export async function getOrSyncStudentProfile(user: User, fallbackUsn?: string): Promise<StudentUser> {
  const metadata = user.user_metadata || {};

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
  };

  if (!isSupabaseConfigured) {
    return defaultProfile;
  }

  try {
    // 1. Try to fetch existing row from student_profiles table
    const { data, error } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (data && !error) {
      return {
        usn: data.usn || defaultProfile.usn,
        name: data.full_name || defaultProfile.name,
        institution: data.institution || defaultProfile.institution,
        department: data.department || defaultProfile.department,
        deptCode: data.dept_code || defaultProfile.deptCode,
        semester: Number(data.semester) || 3,
        section: data.section || defaultProfile.section,
        academicYear: data.academic_year || defaultProfile.academicYear,
        email: data.email || user.email || defaultProfile.email,
        supabaseId: user.id,
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
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select()
      .maybeSingle();

    if (insertedData && !insertError) {
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
      };
    }
  } catch (err) {
    // Silently fall back to user metadata / defaultProfile if table query fails
    console.warn('Could not sync with student_profiles table, using auth metadata:', err);
  }

  return defaultProfile;
}

/**
 * Fallback synchronous mapping of Supabase Auth user object.
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
  };
}
