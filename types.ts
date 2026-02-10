export interface OtcOption {
  name: string;
  purpose: string;
  calculated_dosage: string;
  max_frequency: string;
}

export interface AnalysisResult {
  disclaimer: string;
  identified_medication?: string;
  suitability_check?: 'Yes' | 'No' | 'Partial' | 'N/A';
  specific_calculated_dosage?: string;
  needs_more_info?: boolean;
  clarifying_questions?: string[];
  is_emergency: boolean;
  emergency_instructions: string;
  suggested_otc_options: OtcOption[];
  safety_warnings: string[];
  doctor_visit_triggers: string[];
}

export interface FormData {
  age: string;
  weight: string;
  symptoms: string;
  image: File | null;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
