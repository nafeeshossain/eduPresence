import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Mock course data until we implement course management
const DEFAULT_COURSE_ID = '00000000-0000-0000-0000-000000000001';

export type CheckInMethod = 'qr_code' | 'voice' | 'manual';

export const attendanceService = {
  // Record attendance for a student
  async recordAttendance(
    studentName: string, 
    studentId: string, 
    method: CheckInMethod,
    notes?: string
  ) {
    try {
      // First, find or create the student profile
      const { data: studentProfile, error: studentError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', studentId + '@edu.com')
        .maybeSingle();

      if (studentError) {
        console.error('Error finding student:', studentError);
        toast.error('Failed to find student record');
        return { success: false, error: studentError };
      }

      let studentProfileId = studentProfile?.id;

      // If student doesn't exist, create a temporary profile
      if (!studentProfileId) {
        const { data: newUser, error: createUserError } = await supabase.auth.signUp({
          email: studentId + '@edu.com',
          password: 'TemporaryPassword123!',
          options: {
            data: {
              full_name: studentName,
            },
          },
        });

        if (createUserError) {
          console.error('Error creating user:', createUserError);
          toast.error('Failed to create student record');
          return { success: false, error: createUserError };
        }

        // Wait for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get the newly created profile
        const { data: newProfile, error: newProfileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', newUser.user?.id)
          .maybeSingle();

        if (newProfileError || !newProfile) {
          console.error('Error finding new profile:', newProfileError);
          toast.error('Failed to create student profile');
          return { success: false, error: newProfileError };
        }

        studentProfileId = newProfile.id;
      }

      // Get the current user's profile for recorded_by
      const { data: currentSession } = await supabase.auth.getSession();
      const userId = currentSession.session?.user.id;
      
      let recordedById = null;
      
      if (userId) {
        const { data: currentProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle();
          
        recordedById = currentProfile?.id;
      }

      // Create attendance record
      const { data, error } = await supabase
        .from('attendance_records')
        .insert({
          student_id: studentProfileId,
          course_id: DEFAULT_COURSE_ID,
          check_in_method: method,
          recorded_by: recordedById,
          notes: notes || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error recording attendance:', error);
        toast.error('Failed to record attendance');
        return { success: false, error };
      }

      toast.success(`Attendance recorded for ${studentName}`);
      return { success: true, data };
    } catch (error) {
      console.error('Unexpected error recording attendance:', error);
      toast.error('An unexpected error occurred');
      return { success: false, error };
    }
  },

  // Get recent attendance records
  async getRecentAttendance(limit = 5) {
    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .select(`
          id,
          check_in_time,
          check_in_method,
          notes,
          profiles:student_id(full_name, email)
        `)
        .order('check_in_time', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent attendance:', error);
        return { success: false, error };
      }

      return { 
        success: true, 
        data: data.map(record => ({
          id: record.id,
          studentName: record.profiles?.full_name || 'Unknown',
          studentId: record.profiles?.email?.split('@')[0] || 'Unknown',
          checkInTime: record.check_in_time,
          method: record.check_in_method,
          notes: record.notes
        }))
      };
    } catch (error) {
      console.error('Unexpected error fetching attendance:', error);
      return { success: false, error };
    }
  },

  // Initialize default course if it doesn't exist
  async initializeDefaultCourse() {
    try {
      // Check if default course exists
      const { data: existingCourse, error: checkError } = await supabase
        .from('courses')
        .select('id')
        .eq('id', DEFAULT_COURSE_ID)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking for default course:', checkError);
        return { success: false, error: checkError };
      }

      // If course doesn't exist, create it
      if (!existingCourse) {
        // Get current user's profile for teacher_id
        const { data: currentSession } = await supabase.auth.getSession();
        const userId = currentSession.session?.user.id;
        
        if (!userId) {
          console.error('No user logged in to create default course');
          return { success: false, error: 'No user logged in' };
        }
        
        const { data: currentProfile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle();
          
        if (profileError || !currentProfile) {
          console.error('Error getting current profile:', profileError);
          return { success: false, error: profileError };
        }

        // Create default course
        const { data, error } = await supabase
          .from('courses')
          .insert({
            id: DEFAULT_COURSE_ID,
            name: 'Default Course',
            code: 'DEFAULT101',
            description: 'Default course for attendance tracking',
            teacher_id: currentProfile.id
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating default course:', error);
          return { success: false, error };
        }

        console.log('Default course created:', data);
        return { success: true, data };
      }

      return { success: true, data: existingCourse };
    } catch (error) {
      console.error('Unexpected error initializing default course:', error);
      return { success: false, error };
    }
  }
};