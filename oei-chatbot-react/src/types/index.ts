// Core types for the OEI chatbot application

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Course {
  course_id: number;
  title: string;
  description?: string;
  level: string;
  status: string;
  format: string;
  target_group: string;
  location_city: string;
  price: string;
  currency: string;
  currency_symbol: string;
  web_url?: string;
  checkout_url?: string;
  start_at?: string;
  start_date: string;
  finish_at?: string;
  end_date: string;
  free_places_count?: number;
  free_places: number;
  max_participants: number;
  min_participants: number;
  location_id: number;
  category: string;
  course_type?: string;
  frequency?: string;
  lesson_count?: string;
  lesson_duration?: string;
  books_included?: boolean;
  exam_fees?: string;
  teachers?: Teacher[];
  course_weekdays?: CourseWeekday[];
  country_code?: string;
  country_name?: string;
  status_text?: string;
  deadline_date?: string;
  times_of_day?: string[];
}

export interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  city: string;
  country: string;
}

export interface CourseWeekday {
  start_time: string;
  finish_time: string;
  week_day: string;
}

export interface Location {
  id: number;
  title: string;
  location: string;
  country: {
    id: number;
    country_code: string;
    country_name: string;
  };
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error?: string;
}

export interface CourseSearchParams {
  query: string;
  location_id?: number;
  max_pages?: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface StructuredDataItem {
  type: "course" | "webpage";
  data: CourseData | WebpageData;
}

export interface CourseData {
  course_id: number;
  title: string;
  price: string;
  currency_symbol: string;
  level: string;
  format: string;
  target_group: string;
  start_date: string;
  end_date: string;
  location_city: string;
  free_places: number;
  country_id: number;
  language: string;
  checkout_url?: string;
  web_url?: string;
}

export interface WebpageData {
  title: string;
  url: string;
}

export interface ChatResponse {
  message: string;
  courses?: Course[];
  ai_content?: string;
}

export interface ChatMessage extends Message {
  courses?: Course[];
  ai_content?: string;
}
