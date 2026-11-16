export interface Program {
  id: number;
  name: string;
  description: string;
  active: boolean;
  website_visible: boolean;
}
export interface ClassRecord {
  id: number;
  name: string;
  description: string;
  subject: string;
  code: string;
  course_code: string;
  program: number | null;
  teacher: number | null;
  teacher_name: string;
  state: "draft" | "open" | "closed" | "completed";
  website_visible: boolean;
  modules: string[];
  enrolled: boolean;
}
export interface StudentRecord {
  id: number;
  user_id: number;
  name: string;
  student_id: string;
  email: string;
  status: "admitted" | "suspended";
  activated: boolean;
}
export interface TeacherRecord {
  id: number;
  user_id: number;
  name: string;
  username: string;
  email: string;
  status: "invited" | "approved" | "suspended";
  can_announce_classes: boolean;
}
export interface EnrollmentRecord {
  id: number;
  course: number;
  class_name: string;
  student_id: string | null;
  user_id: number | null;
  name: string;
  status: string;
}
export interface ApplicationRecord {
  id: string;
  record_id: number;
  type: "volunteer" | "admission" | "enrollment";
  name: string;
  email: string;
  status: string;
  created_at: string;
  class_name?: string;
  student_id?: string;
}
export interface MaterialRecord {
  id: number;
  course: number;
  title: string;
  video_url: string;
  created_at: string;
}
export interface LiveRecord {
  id: number;
  course: number;
  title: string;
  starts_at: string;
  ends_at: string;
  meeting_url: string;
  cancelled: boolean;
}
export interface QuestionRecord {
  id?: number;
  kind: "mcq" | "written";
  prompt: string;
  points: number;
  options: Array<{ id: string; text: string }>;
  correct_option?: string;
  explanation?: string;
}
export interface ExamRecord {
  id: number;
  course: number;
  title: string;
  duration_minutes: number;
  passing_score: number;
  attempt_limit: number;
  available_from: string | null;
  available_until: string | null;
  published: boolean;
  questions: QuestionRecord[];
}
export interface AttemptRecord {
  id: number;
  exam: number;
  course: number;
  student: number;
  student_name: string;
  can_manage: boolean;
  title: string;
  started_at: string;
  deadline: string;
  server_time: string;
  submitted_at: string | null;
  published_at: string | null;
  questions: QuestionRecord[];
  answers: Record<string, string>;
  marks: Record<string, number>;
  feedback: Record<string, string>;
  score: number | null;
  max_score: number;
  percentage: number | null;
  passed: boolean | null;
  fully_graded: boolean;
}
export interface NominationRecord {
  id: number;
  course: number;
  recipient: number;
  kind: string;
  title: string;
  reason: string;
  status: string;
  nominated_by: number;
}
export interface CredentialRecord {
  id: number;
  code: string;
  recipient_name: string;
  title: string;
  kind: string;
  issuer: string;
  issued_at: string;
  expires_at: string | null;
  status: "valid" | "revoked" | "expired";
  verification_url: string;
}
export interface NoticeRecord {
  id: number;
  message: string;
  link: string;
  read: boolean;
  created_at: string;
}

// Connected workflow release: additive contracts shared across application roots.
export interface EducationAccountRecord {
  id: number;
  name: string;
  email: string;
  username: string;
  student_id: string | null;
  student_status: string | null;
  teacher_status: string | null;
  student_archived: boolean;
  teacher_archived: boolean;
  is_superuser: boolean;
  activated: boolean;
  can_announce_classes: boolean;
}
export interface AdmissionReferralRecord {
  id: number;
  name: string;
  email: string;
  class_name: string;
  admission_status: string;
  enrollment_status: string;
}
export interface PagedData<T> {
  results: T[];
  count: number;
  has_next: boolean;
  page: number;
}
export interface EducationContact {
  id: number;
  name: string;
  email?: string;
}
export interface ConversationRecord {
  id: number;
  peer_id: number;
  peer_name: string;
  unread_count: number;
  can_send: boolean;
  last_message: {
    id: number;
    author_id: number;
    body: string;
    created_at: string;
  } | null;
}
export interface DirectMessageRecord {
  id: number;
  author_id: number;
  body: string;
  created_at: string;
}
export interface ConversationMessages {
  conversation: ConversationRecord;
  results: DirectMessageRecord[];
  has_older: boolean;
}
export interface NotificationPage extends PagedData<NoticeRecord> {
  unread_count: number;
}
export interface OutboundEmailRecord {
  id: number;
  recipient: string;
  subject: string;
  body: string;
  status: "pending" | "sent" | "failed";
  last_error: string;
  attempts: number;
  created_at: string;
  sent_at: string | null;
}
