import { supabase } from "./supabase";
import type { Database } from "./supabase";

type Tables = Database["public"]["Tables"];

// Type definitions
export type Profile = Tables["profiles"]["Row"];
export type Faculty = Tables["faculties"]["Row"];
export type Student = Tables["students"]["Row"];
export type Lecturer = Tables["lecturers"]["Row"];
export type Course = Tables["courses"]["Row"];
export type Enrollment = Tables["enrollments"]["Row"];
export type Announcement = Tables["announcements"]["Row"];
export type Payment = Tables["payments"]["Row"];
export type Assignment = Tables["assignments"]["Row"];
export type Material = Tables["materials"]["Row"];
export type Quiz = Tables["quizzes"]["Row"];
export type Grade = Tables["grades"]["Row"];
export type Attendance = Tables["attendance"]["Row"];
export type SupportTicket = Tables["support_tickets"]["Row"];
export type Scholarship = Tables["scholarships"]["Row"];
export type Refund = Tables["refunds"]["Row"];
export type TuitionFee = Tables["tuition_fees"]["Row"];
export type Exam = Tables["exams"]["Row"];
export type Registration = Tables["registrations"]["Row"];
export type Staff = Tables["staff"]["Row"];
export type CalendarEvent = Tables["calendar_events"]["Row"];

// Profile operations
export const profileService = {
  async getProfile(
    userId: string,
  ): Promise<{ data: Profile | null; error: any }> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    return { data, error };
  },

  async updateProfile(
    userId: string,
    updates: Partial<Profile>,
  ): Promise<{ data: Profile | null; error: any }> {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();
    return { data, error };
  },

  async getAllProfiles(): Promise<{ data: Profile[] | null; error: any }> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    return { data, error };
  },
};

// Faculty operations
export const facultyService = {
  async getFaculties(): Promise<{ data: Faculty[] | null; error: any }> {
    const { data, error } = await supabase
      .from("faculties")
      .select("*")
      .order("name");
    return { data, error };
  },

  async getFaculty(id: string): Promise<{ data: Faculty | null; error: any }> {
    const { data, error } = await supabase
      .from("faculties")
      .select("*")
      .eq("id", id)
      .single();
    return { data, error };
  },

  async createFaculty(
    faculty: Omit<Faculty, "id" | "created_at" | "updated_at">,
  ): Promise<{ data: Faculty | null; error: any }> {
    const { data, error } = await supabase
      .from("faculties")
      .insert(faculty)
      .select()
      .single();
    return { data, error };
  },

  async updateFaculty(
    id: string,
    updates: Partial<Faculty>,
  ): Promise<{ data: Faculty | null; error: any }> {
    const { data, error } = await supabase
      .from("faculties")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  async deleteFaculty(id: string): Promise<{ error: any }> {
    const { error } = await supabase.from("faculties").delete().eq("id", id);
    return { error };
  },
};

// Student operations
export const studentService = {
  async getStudents(): Promise<{
    data: (Student & { profile: Profile; faculty: Faculty })[] | null;
    error: any;
  }> {
    const { data, error } = await supabase
      .from("students")
      .select(
        `
        *,
        profile:profiles(*),
        faculty:faculties(*)
      `,
      )
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async getStudent(
    id: string,
  ): Promise<{
    data: (Student & { profile: Profile; faculty: Faculty }) | null;
    error: any;
  }> {
    const { data, error } = await supabase
      .from("students")
      .select(
        `
        *,
        profile:profiles(*),
        faculty:faculties(*)
      `,
      )
      .eq("id", id)
      .single();
    return { data, error };
  },

  async getStudentByProfile(
    profileId: string,
  ): Promise<{
    data: (Student & { profile: Profile; faculty: Faculty }) | null;
    error: any;
  }> {
    const { data, error } = await supabase
      .from("students")
      .select(
        `
        *,
        profile:profiles(*),
        faculty:faculties(*)
      `,
      )
      .eq("profile_id", profileId)
      .single();
    return { data, error };
  },

  async createStudent(
    student: Omit<Student, "id" | "created_at" | "updated_at">,
  ): Promise<{ data: Student | null; error: any }> {
    const { data, error } = await supabase
      .from("students")
      .insert(student)
      .select()
      .single();
    return { data, error };
  },

  async updateStudent(
    id: string,
    updates: Partial<Student>,
  ): Promise<{ data: Student | null; error: any }> {
    const { data, error } = await supabase
      .from("students")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  async deleteStudent(id: string): Promise<{ error: any }> {
    const { error } = await supabase.from("students").delete().eq("id", id);
    return { error };
  },

  async getStudentsByIds(
    ids: string[],
  ): Promise<{ data: (Student & { profile: Profile })[] | null; error: any }> {
    const { data, error } = await supabase
      .from("students")
      .select(
        `
        *,
        profile:profiles(*)
      `,
      )
      .in("id", ids);
    return { data, error };
  },
};

// Lecturer operations
export const lecturerService = {
  async getLecturers(): Promise<{
    data: (Lecturer & { profile: Profile; faculty: Faculty })[] | null;
    error: any;
  }> {
    const { data, error } = await supabase
      .from("lecturers")
      .select(
        `
        *,
        profile:profiles(*),
        faculty:faculties(*)
      `,
      )
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async getLecturer(
    id: string,
  ): Promise<{
    data: (Lecturer & { profile: Profile; faculty: Faculty }) | null;
    error: any;
  }> {
    const { data, error } = await supabase
      .from("lecturers")
      .select(
        `
        *,
        profile:profiles(*),
        faculty:faculties(*)
      `,
      )
      .eq("id", id)
      .single();
    return { data, error };
  },

  async getLecturerByProfile(
    profileId: string,
  ): Promise<{
    data: (Lecturer & { profile: Profile; faculty: Faculty }) | null;
    error: any;
  }> {
    const { data, error } = await supabase
      .from("lecturers")
      .select(
        `
        *,
        profile:profiles(*),
        faculty:faculties(*)
      `,
      )
      .eq("profile_id", profileId)
      .single();
    return { data, error };
  },

  async createLecturer(
    lecturer: Omit<Lecturer, "id" | "created_at" | "updated_at">,
  ): Promise<{ data: Lecturer | null; error: any }> {
    const { data, error } = await supabase
      .from("lecturers")
      .insert(lecturer)
      .select()
      .single();
    return { data, error };
  },

  async updateLecturer(
    id: string,
    updates: Partial<Lecturer>,
  ): Promise<{ data: Lecturer | null; error: any }> {
    const { data, error } = await supabase
      .from("lecturers")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  async deleteLecturer(id: string): Promise<{ error: any }> {
    const { error } = await supabase.from("lecturers").delete().eq("id", id);
    return { error };
  },

  async getLecturersByIds(
    ids: string[],
  ): Promise<{ data: (Lecturer & { profile: Profile })[] | null; error: any }> {
    const { data, error } = await supabase
      .from("lecturers")
      .select(
        `
        *,
        profile:profiles(*)
      `,
      )
      .in("id", ids);
    return { data, error };
  },
};

// Course operations
export const courseService = {
  async getCourses(): Promise<{
    data:
      | (Course & {
          faculty: Faculty;
          lecturer: (Lecturer & { profile: Profile }) | null;
        })[]
      | null;
    error: any;
  }> {
    const { data, error } = await supabase
      .from("courses")
      .select(
        `
        *,
        faculty:faculties(*),
        lecturer:lecturers(
          *,
          profile:profiles(*)
        )
      `,
      )
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async getCourse(
    id: string,
  ): Promise<{
    data:
      | (Course & {
          faculty: Faculty;
          lecturer: (Lecturer & { profile: Profile }) | null;
        })
      | null;
    error: any;
  }> {
    const { data, error } = await supabase
      .from("courses")
      .select(
        `
        *,
        faculty:faculties(*),
        lecturer:lecturers(
          *,
          profile:profiles(*)
        )
      `,
      )
      .eq("id", id)
      .single();
    return { data, error };
  },

  async getCoursesByLecturer(
    lecturerId: string,
  ): Promise<{ data: (Course & { faculty: Faculty })[] | null; error: any }> {
    const { data, error } = await supabase
      .from("courses")
      .select(
        `
        *,
        faculty:faculties(*)
      `,
      )
      .eq("lecturer_id", lecturerId)
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async getCoursesByIds(
    ids: string[],
  ): Promise<{ data: Course[] | null; error: any }> {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .in("id", ids);
    return { data, error };
  },

  async createCourse(
    course: Omit<Course, "id" | "created_at" | "updated_at">,
  ): Promise<{ data: Course | null; error: any }> {
    const { data, error } = await supabase
      .from("courses")
      .insert(course)
      .select()
      .single();
    return { data, error };
  },

  async updateCourse(
    id: string,
    updates: Partial<Course>,
  ): Promise<{ data: Course | null; error: any }> {
    const { data, error } = await supabase
      .from("courses")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  async deleteCourse(id: string): Promise<{ error: any }> {
    const { error } = await supabase.from("courses").delete().eq("id", id);
    return { error };
  },
};

// Enrollment operations
export const enrollmentService = {
  async getEnrollments(): Promise<{
    data:
      | (Enrollment & {
          student: Student & { profile: Profile };
          course: Course;
        })[]
      | null;
    error: any;
  }> {
    const { data, error } = await supabase
      .from("enrollments")
      .select(
        `
        *,
        student:students(
          *,
          profile:profiles(*)
        ),
        course:courses(*)
      `,
      )
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async getEnrollmentsByStudent(
    studentId: string,
  ): Promise<{ data: (Enrollment & { course: Course })[] | null; error: any }> {
    const { data, error } = await supabase
      .from("enrollments")
      .select(
        `
        *,
        course:courses(*)
      `,
      )
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async createEnrollment(
    enrollment: Omit<Enrollment, "id" | "created_at" | "updated_at">,
  ): Promise<{ data: Enrollment | null; error: any }> {
    const { data, error } = await supabase
      .from("enrollments")
      .insert(enrollment)
      .select()
      .single();
    return { data, error };
  },

  async updateEnrollment(
    id: string,
    updates: Partial<Enrollment>,
  ): Promise<{ data: Enrollment | null; error: any }> {
    const { data, error } = await supabase
      .from("enrollments")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  async deleteEnrollment(id: string): Promise<{ error: any }> {
    const { error } = await supabase.from("enrollments").delete().eq("id", id);
    return { error };
  },
};

// Assignment operations
export const assignmentService = {
  async getAssignments(): Promise<{
    data: (Assignment & { course: Course })[] | null;
    error: any;
  }> {
    const { data, error } = await supabase
      .from("assignments")
      .select(
        `
        *,
        course:courses(*)
      `,
      )
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async getAssignmentsByLecturer(
    lecturerId: string,
  ): Promise<{ data: (Assignment & { course: Course })[] | null; error: any }> {
    const { data, error } = await supabase
      .from("assignments")
      .select(
        `
        *,
        course:courses(*)
      `,
      )
      .eq("lecturer_id", lecturerId)
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async getAssignmentsByCourse(
    courseId: string,
  ): Promise<{ data: Assignment[] | null; error: any }> {
    const { data, error } = await supabase
      .from("assignments")
      .select("*")
      .eq("course_id", courseId)
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async createAssignment(
    assignment: Omit<Assignment, "id" | "created_at" | "updated_at">,
  ): Promise<{ data: Assignment | null; error: any }> {
    const { data, error } = await supabase
      .from("assignments")
      .insert(assignment)
      .select()
      .single();
    return { data, error };
  },

  async updateAssignment(
    id: string,
    updates: Partial<Assignment>,
  ): Promise<{ data: Assignment | null; error: any }> {
    const { data, error } = await supabase
      .from("assignments")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  async deleteAssignment(id: string): Promise<{ error: any }> {
    const { error } = await supabase.from("assignments").delete().eq("id", id);
    return { error };
  },
};

// Material operations
export const materialService = {
  async getMaterials(): Promise<{
    data: (Material & { course: Course })[] | null;
    error: any;
  }> {
    const { data, error } = await supabase
      .from("materials")
      .select(
        `
        *,
        course:courses(*)
      `,
      )
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async getMaterialsByLecturer(
    lecturerId: string,
  ): Promise<{ data: (Material & { course: Course })[] | null; error: any }> {
    const { data, error } = await supabase
      .from("materials")
      .select(
        `
        *,
        course:courses(*)
      `,
      )
      .eq("lecturer_id", lecturerId)
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async getMaterialsByCourse(
    courseId: string,
  ): Promise<{ data: Material[] | null; error: any }> {
    const { data, error } = await supabase
      .from("materials")
      .select("*")
      .eq("course_id", courseId)
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async createMaterial(
    material: Omit<Material, "id" | "created_at" | "updated_at">,
  ): Promise<{ data: Material | null; error: any }> {
    const { data, error } = await supabase
      .from("materials")
      .insert(material)
      .select()
      .single();
    return { data, error };
  },

  async updateMaterial(
    id: string,
    updates: Partial<Material>,
  ): Promise<{ data: Material | null; error: any }> {
    const { data, error } = await supabase
      .from("materials")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  async deleteMaterial(id: string): Promise<{ error: any }> {
    const { error } = await supabase.from("materials").delete().eq("id", id);
    return { error };
  },
};

// Quiz operations
export const quizService = {
  async getQuizzes(): Promise<{
    data: (Quiz & { course: Course })[] | null;
    error: any;
  }> {
    const { data, error } = await supabase
      .from("quizzes")
      .select(
        `
        *,
        course:courses(*)
      `,
      )
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async getQuizzesByLecturer(
    lecturerId: string,
  ): Promise<{ data: (Quiz & { course: Course })[] | null; error: any }> {
    const { data, error } = await supabase
      .from("quizzes")
      .select(
        `
        *,
        course:courses(*)
      `,
      )
      .eq("lecturer_id", lecturerId)
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async getQuizzesByCourse(
    courseId: string,
  ): Promise<{ data: Quiz[] | null; error: any }> {
    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .eq("course_id", courseId)
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async createQuiz(
    quiz: Omit<Quiz, "id" | "created_at" | "updated_at">,
  ): Promise<{ data: Quiz | null; error: any }> {
    const { data, error } = await supabase
      .from("quizzes")
      .insert(quiz)
      .select()
      .single();
    return { data, error };
  },

  async updateQuiz(
    id: string,
    updates: Partial<Quiz>,
  ): Promise<{ data: Quiz | null; error: any }> {
    const { data, error } = await supabase
      .from("quizzes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  async deleteQuiz(id: string): Promise<{ error: any }> {
    const { error } = await supabase.from("quizzes").delete().eq("id", id);
    return { error };
  },
};

// Grade operations
export const gradeService = {
  async getGrades(): Promise<{
    data:
      | (Grade & { student: Student & { profile: Profile }; course: Course })[]
      | null;
    error: any;
  }> {
    const { data, error } = await supabase
      .from("grades")
      .select(
        `
        *,
        student:students(
          *,
          profile:profiles(*)
        ),
        course:courses(*)
      `,
      )
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async getGradesByStudent(
    studentId: string,
  ): Promise<{ data: (Grade & { course: Course })[] | null; error: any }> {
    const { data, error } = await supabase
      .from("grades")
      .select(
        `
        *,
        course:courses(*)
      `,
      )
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async getGradesByLecturer(
    lecturerId: string,
  ): Promise<{
    data:
      | (Grade & { student: Student & { profile: Profile }; course: Course })[]
      | null;
    error: any;
  }> {
    const { data, error } = await supabase
      .from("grades")
      .select(
        `
        *,
        student:students(
          *,
          profile:profiles(*)
        ),
        course:courses(*)
      `,
      )
      .eq("lecturer_id", lecturerId)
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async createGrade(
    grade: Omit<Grade, "id" | "created_at" | "updated_at">,
  ): Promise<{ data: Grade | null; error: any }> {
    const { data, error } = await supabase
      .from("grades")
      .insert(grade)
      .select()
      .single();
    return { data, error };
  },

  async updateGrade(
    id: string,
    updates: Partial<Grade>,
  ): Promise<{ data: Grade | null; error: any }> {
    const { data, error } = await supabase
      .from("grades")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  async deleteGrade(id: string): Promise<{ error: any }> {
    const { error } = await supabase.from("grades").delete().eq("id", id);
    return { error };
  },
};

// Attendance operations
export const attendanceService = {
  async getAttendance(): Promise<{
    data:
      | (Attendance & {
          student: Student & { profile: Profile };
          course: Course;
        })[]
      | null;
    error: any;
  }> {
    const { data, error } = await supabase
      .from("attendance")
      .select(
        `
        *,
        student:students(
          *,
          profile:profiles(*)
        ),
        course:courses(*)
      `,
      )
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async getAttendanceByLecturer(
    lecturerId: string,
  ): Promise<{
    data:
      | (Attendance & {
          student: Student & { profile: Profile };
          course: Course;
        })[]
      | null;
    error: any;
  }> {
    const { data, error } = await supabase
      .from("attendance")
      .select(
        `
        *,
        student:students(
          *,
          profile:profiles(*)
        ),
        course:courses(*)
      `,
      )
      .eq("lecturer_id", lecturerId)
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async getAttendanceByStudent(
    studentId: string,
  ): Promise<{ data: (Attendance & { course: Course })[] | null; error: any }> {
    const { data, error } = await supabase
      .from("attendance")
      .select(
        `
        *,
        course:courses(*)
      `,
      )
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async createAttendance(
    attendance: Omit<Attendance, "id" | "created_at" | "updated_at">,
  ): Promise<{ data: Attendance | null; error: any }> {
    const { data, error } = await supabase
      .from("attendance")
      .insert(attendance)
      .select()
      .single();
    return { data, error };
  },

  async updateAttendance(
    id: string,
    updates: Partial<Attendance>,
  ): Promise<{ data: Attendance | null; error: any }> {
    const { data, error } = await supabase
      .from("attendance")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  async deleteAttendance(id: string): Promise<{ error: any }> {
    const { error } = await supabase.from("attendance").delete().eq("id", id);
    return { error };
  },
};

// Announcement operations
export const announcementService = {
  async getAnnouncements(): Promise<{
    data: (Announcement & { author: Profile })[] | null;
    error: any;
  }> {
    const { data, error } = await supabase
      .from("announcements")
      .select(
        `
        *,
        author:profiles(*)
      `,
      )
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async getPublishedAnnouncements(): Promise<{
    data: (Announcement & { author: Profile })[] | null;
    error: any;
  }> {
    const { data, error } = await supabase
      .from("announcements")
      .select(
        `
        *,
        author:profiles(*)
      `,
      )
      .eq("status", "published")
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async createAnnouncement(
    announcement: Omit<Announcement, "id" | "created_at" | "updated_at">,
  ): Promise<{ data: Announcement | null; error: any }> {
    const { data, error } = await supabase
      .from("announcements")
      .insert(announcement)
      .select()
      .single();
    return { data, error };
  },

  async updateAnnouncement(
    id: string,
    updates: Partial<Announcement>,
  ): Promise<{ data: Announcement | null; error: any }> {
    const { data, error } = await supabase
      .from("announcements")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  async deleteAnnouncement(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id);
    return { error };
  },
};

// Payment operations
export const paymentService = {
  async getPayments(): Promise<{
    data: (Payment & { student: Student & { profile: Profile } })[] | null;
    error: any;
  }> {
    const { data, error } = await supabase
      .from("payments")
      .select(
        `
        *,
        student:students(
          *,
          profile:profiles(*)
        )
      `,
      )
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async getStudentPayments(
    studentId: string,
  ): Promise<{ data: Payment[] | null; error: any }> {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async createPayment(
    payment: Omit<Payment, "id" | "created_at" | "updated_at">,
  ): Promise<{ data: Payment | null; error: any }> {
    const { data, error } = await supabase
      .from("payments")
      .insert(payment)
      .select()
      .single();
    return { data, error };
  },

  async updatePayment(
    id: string,
    updates: Partial<Payment>,
  ): Promise<{ data: Payment | null; error: any }> {
    const { data, error } = await supabase
      .from("payments")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  async deletePayment(id: string): Promise<{ error: any }> {
    const { error } = await supabase.from("payments").delete().eq("id", id);
    return { error };
  },
};

// Support ticket operations
export const supportService = {
  async getSupportTickets(): Promise<{
    data:
      | (SupportTicket & { student: Student & { profile: Profile } })[]
      | null;
    error: any;
  }> {
    const { data, error } = await supabase
      .from("support_tickets")
      .select(
        `
        *,
        student:students(
          *,
          profile:profiles(*)
        )
      `,
      )
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async getSupportTicketsByStudent(
    studentId: string,
  ): Promise<{ data: SupportTicket[] | null; error: any }> {
    const { data, error } = await supabase
      .from("support_tickets")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async createSupportTicket(
    ticket: Omit<SupportTicket, "id" | "created_at" | "updated_at">,
  ): Promise<{ data: SupportTicket | null; error: any }> {
    const { data, error } = await supabase
      .from("support_tickets")
      .insert(ticket)
      .select()
      .single();
    return { data, error };
  },

  async updateSupportTicket(
    id: string,
    updates: Partial<SupportTicket>,
  ): Promise<{ data: SupportTicket | null; error: any }> {
    const { data, error } = await supabase
      .from("support_tickets")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  async deleteSupportTicket(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from("support_tickets")
      .delete()
      .eq("id", id);
    return { error };
  },
};

// Scholarship operations
export const scholarshipService = {
  async getScholarships(): Promise<{
    data: (Scholarship & { student: Student & { profile: Profile } })[] | null;
    error: any;
  }> {
    const { data, error } = await supabase
      .from("scholarships")
      .select(
        `
        *,
        student:students(
          *,
          profile:profiles(*)
        )
      `,
      )
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async createScholarship(
    scholarship: Omit<Scholarship, "id" | "created_at" | "updated_at">,
  ): Promise<{ data: Scholarship | null; error: any }> {
    const { data, error } = await supabase
      .from("scholarships")
      .insert(scholarship)
      .select()
      .single();
    return { data, error };
  },

  async updateScholarship(
    id: string,
    updates: Partial<Scholarship>,
  ): Promise<{ data: Scholarship | null; error: any }> {
    const { data, error } = await supabase
      .from("scholarships")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  async deleteScholarship(id: string): Promise<{ error: any }> {
    const { error } = await supabase.from("scholarships").delete().eq("id", id);
    return { error };
  },
};

// Refund operations
export const refundService = {
  async getRefunds(): Promise<{
    data:
      | (Refund & { student: Student & { profile: Profile }; course: Course })[]
      | null;
    error: any;
  }> {
    const { data, error } = await supabase
      .from("refunds")
      .select(
        `
        *,
        student:students(
          *,
          profile:profiles(*)
        ),
        course:courses(*)
      `,
      )
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async createRefund(
    refund: Omit<Refund, "id" | "created_at" | "updated_at">,
  ): Promise<{ data: Refund | null; error: any }> {
    const { data, error } = await supabase
      .from("refunds")
      .insert(refund)
      .select()
      .single();
    return { data, error };
  },

  async updateRefund(
    id: string,
    updates: Partial<Refund>,
  ): Promise<{ data: Refund | null; error: any }> {
    const { data, error } = await supabase
      .from("refunds")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  async deleteRefund(id: string): Promise<{ error: any }> {
    const { error } = await supabase.from("refunds").delete().eq("id", id);
    return { error };
  },
};

// Tuition fee operations
export const tuitionService = {
  async getTuitionFees(): Promise<{
    data: (TuitionFee & { faculty: Faculty })[] | null;
    error: any;
  }> {
    const { data, error } = await supabase
      .from("tuition_fees")
      .select(
        `
        *,
        faculty:faculties(*)
      `,
      )
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async createTuitionFee(
    fee: Omit<TuitionFee, "id" | "created_at" | "updated_at">,
  ): Promise<{ data: TuitionFee | null; error: any }> {
    const { data, error } = await supabase
      .from("tuition_fees")
      .insert(fee)
      .select()
      .single();
    return { data, error };
  },

  async updateTuitionFee(
    id: string,
    updates: Partial<TuitionFee>,
  ): Promise<{ data: TuitionFee | null; error: any }> {
    const { data, error } = await supabase
      .from("tuition_fees")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  async deleteTuitionFee(id: string): Promise<{ error: any }> {
    const { error } = await supabase.from("tuition_fees").delete().eq("id", id);
    return { error };
  },
};

// Exam operations
export const examService = {
  async getExams(): Promise<{
    data: (Exam & { course: Course })[] | null;
    error: any;
  }> {
    const { data, error } = await supabase
      .from("exams")
      .select(
        `
        *,
        course:courses(*)
      `,
      )
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async createExam(
    exam: Omit<Exam, "id" | "created_at" | "updated_at">,
  ): Promise<{ data: Exam | null; error: any }> {
    const { data, error } = await supabase
      .from("exams")
      .insert(exam)
      .select()
      .single();
    return { data, error };
  },

  async updateExam(
    id: string,
    updates: Partial<Exam>,
  ): Promise<{ data: Exam | null; error: any }> {
    const { data, error } = await supabase
      .from("exams")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  async deleteExam(id: string): Promise<{ error: any }> {
    const { error } = await supabase.from("exams").delete().eq("id", id);
    return { error };
  },
};

// Registration operations
export const registrationService = {
  async getRegistrations(): Promise<{
    data:
      | (Registration & {
          student: Student & { profile: Profile };
          course: Course;
        })[]
      | null;
    error: any;
  }> {
    const { data, error } = await supabase
      .from("registrations")
      .select(
        `
        *,
        student:students(
          *,
          profile:profiles(*)
        ),
        course:courses(*)
      `,
      )
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async createRegistration(
    registration: Omit<Registration, "id" | "created_at" | "updated_at">,
  ): Promise<{ data: Registration | null; error: any }> {
    const { data, error } = await supabase
      .from("registrations")
      .insert(registration)
      .select()
      .single();
    return { data, error };
  },

  async updateRegistration(
    id: string,
    updates: Partial<Registration>,
  ): Promise<{ data: Registration | null; error: any }> {
    const { data, error } = await supabase
      .from("registrations")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  async deleteRegistration(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from("registrations")
      .delete()
      .eq("id", id);
    return { error };
  },
};

// Staff operations
export const staffService = {
  async getStaff(): Promise<{
    data: (Staff & { profile: Profile; faculty: Faculty })[] | null;
    error: any;
  }> {
    const { data, error } = await supabase
      .from("staff")
      .select(
        `
        *,
        profile:profiles(*),
        faculty:faculties(*)
      `,
      )
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async createStaff(
    staff: Omit<Staff, "id" | "created_at" | "updated_at">,
  ): Promise<{ data: Staff | null; error: any }> {
    const { data, error } = await supabase
      .from("staff")
      .insert(staff)
      .select()
      .single();
    return { data, error };
  },

  async updateStaff(
    id: string,
    updates: Partial<Staff>,
  ): Promise<{ data: Staff | null; error: any }> {
    const { data, error } = await supabase
      .from("staff")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  async deleteStaff(id: string): Promise<{ error: any }> {
    const { error } = await supabase.from("staff").delete().eq("id", id);
    return { error };
  },
};

// Calendar event operations
export const calendarService = {
  async getCalendarEvents(): Promise<{
    data: CalendarEvent[] | null;
    error: any;
  }> {
    const { data, error } = await supabase
      .from("calendar_events")
      .select("*")
      .order("event_date", { ascending: true });
    return { data, error };
  },

  async createCalendarEvent(
    event: Omit<CalendarEvent, "id" | "created_at" | "updated_at">,
  ): Promise<{ data: CalendarEvent | null; error: any }> {
    const { data, error } = await supabase
      .from("calendar_events")
      .insert(event)
      .select()
      .single();
    return { data, error };
  },

  async updateCalendarEvent(
    id: string,
    updates: Partial<CalendarEvent>,
  ): Promise<{ data: CalendarEvent | null; error: any }> {
    const { data, error } = await supabase
      .from("calendar_events")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  async deleteCalendarEvent(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from("calendar_events")
      .delete()
      .eq("id", id);
    return { error };
  },
};
