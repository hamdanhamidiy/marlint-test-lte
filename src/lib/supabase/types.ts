export type UserRole = 'student' | 'instructor' | 'admin' | 'super_admin' | 'deactivated';
export type UserStatus = 'active' | 'inactive' | 'banned';

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string;
  phone_number: string | null;
  role: UserRole;
  status: UserStatus;
  level: string | null;
  level_code: string;
  total_points: number;
  photo_url: string | null;
  about: string | null;
  job_title: string | null;
  date_of_birth: string | null;
  nationality: string | null;
  placement_test_taken: boolean;
  placement_test_date: string | null;
  department_track?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MarlintTest {
  id: string;
  test_number: number;
  test_name: string;
  description: string;
  duration: number; // minutes
  total_questions: number;
  passing_grade: number;
  difficulty_level: string;
  is_free: boolean;
  price: number;
  currency: string;
  question_composition: Record<string, number>;
  icon_url: string | null;
  deck_type?: string;
  color: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type QuestionCategory =
  | 'grammar'
  | 'vocabulary'
  | 'listening_comprehension'
  | 'reading_comprehension'
  | 'time_and_numbers'
  | 'pronunciation';

export type QuestionType =
  | 'multiple_choice'
  | 'gap_fill'
  | 'sentence_reorder'
  | 'drag_drop_label'
  | 'image_choice'
  | 'paragraph_title_match'
  | 'audio_question'
  | 'audio_listening'
  | 'voice_recording';

export interface GapDefinition {
  index: number;
  options: string[];
  correct?: string;
}

export interface DropZone {
  id: string;
  x?: number;
  y?: number;
  correct_label?: string;
  hint?: string;
  label?: string;
  description?: string;
}

export interface ParagraphMatchItem {
  id: string;
  text: string;
}

export interface QuestionData {
  // Gap fill
  text_template?: string;
  gaps?: GapDefinition[];

  // Sentence reorder
  words?: string[];
  correct_sentence?: string;

  // Drag drop
  labels?: string[];
  drop_zones?: DropZone[];

  // Image choice
  option_type?: string;
  option_labels?: string[];
  audio_transcript?: string;

  // Paragraph match
  paragraphs?: ParagraphMatchItem[];
  titles?: string[];
  correct_matches?: Record<string, string>;
  extra_title?: string;

  // Voice recording
  expected_pronunciation?: string;
  [key: string]: any;
}

export interface Question {
  id: string;
  category: QuestionCategory;
  question_text: string;
  question_type: QuestionType;
  options?: string[];
  correct_answer?: string; // stripped during live tests
  explanation?: string;
  level: string;
  audio_url: string | null;
  image_url: string | null;
  pronunciation_text: string | null;
  expected_pronunciation?: string | null;
  question_data: QuestionData;
  marlint_test_id?: string | null;
  marlint_test_number?: number | null;
  is_active: boolean;
  points?: number;
  created_at?: string;
  order_number?: number;
}

export interface TestAttempt {
  id: string;
  user_id: string;
  marlint_test_id: string;
  test_number: number;
  status: 'active' | 'submitted' | 'completed' | 'expired' | 'cancelled';
  question_ids: string[];
  question_snapshot: Question[];
  answer_payload?: Record<string, any>;
  result_payload?: TestResultResponse;
  started_at: string;
  expires_at: string;
  submitted_at?: string | null;
  result_id?: string | null;
  created_at: string;
}

export interface CategoryScoreDetail {
  correct: number;
  total: number;
}

export interface StudentResult {
  id: string;
  student_id: string;
  test_session_id?: string;
  attempt_id: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  level: string;
  category_scores: Record<string, CategoryScoreDetail>;
  start_time: string;
  end_time: string;
  is_passed: boolean;
  test_name: string;
  marlint_test_number: number;
  test_mode: string;
  points_earned: number;
  time_spent_seconds: number;
  created_at: string;
}

export interface Certificate {
  id: string;
  certificate_number: string;
  user_id: string;
  marlint_test_id: string;
  result_id: string;
  student_name: string;
  student_email?: string | null;
  test_name: string;
  test_number: number;
  score: number;
  grade: string;
  level: string;
  is_passed: boolean;
  category_scores: Record<string, CategoryScoreDetail>;
  total_questions: number;
  correct_answers: number;
  duration_minutes: number;
  passing_grade: number;
  completion_date: string;
  is_valid: boolean;
  certificate_url?: string | null;
  verification_code: string;
  issued_at: string;
}

export interface TestResultResponse {
  success: boolean;
  idempotent?: boolean;
  result: {
    id: string;
    attempt_id: string;
    score: number;
    correct_answers: number;
    total_questions: number;
    is_passed: boolean;
    level: string;
    category_scores: Record<string, CategoryScoreDetail>;
    start_time: string;
    end_time: string;
    time_spent_seconds: number;
    test_name: string;
    test_number: number;
    points_earned: number;
  };
  certificate?: {
    id: string;
    certificate_number: string;
    verification_code: string;
  } | null;
}

export interface LevelInfo {
  code: string;
  name: string;
  description: string;
  order_index: number;
  min_score: number;
  color?: string;
  icon?: string;
}

export interface Article {
  id: string;
  title: string;
  summary?: string;
  content: string;
  category?: string;
  author?: string;
  image_url?: string | null;
  read_time_minutes?: number;
  is_published: boolean;
  published_at?: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  is_read: boolean;
  created_at: string;
}
