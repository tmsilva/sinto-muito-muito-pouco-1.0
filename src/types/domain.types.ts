export interface AIModel {
  id: string;
  provider: string;
  model_name: string;
  display_name: string;
  api_identifier: string;
  is_active: boolean;
  is_deprecated: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface AISettings {
  id: string;
  default_model_id: string | null;
  temperature: number;
  max_tokens: number;
  timeout_ms: number;
  system_prompt: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ExcuseTone {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface PromptTemplate {
  id: string;
  name: string;
  version: number;
  is_active: boolean;
  description: string | null;
  system_prompt: string;
  user_prompt: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ApplicationSetting {
  id: string;
  key: string;
  value: string;
  type: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Excuse {
  id: string;
  user_id: string | null;
  input_context: string;
  generated_text: string;
  tone_id: string | null;
  model_id: string | null;
  used_temperature: number;
  used_max_tokens: number;
  status: string;
  favorite: boolean;
  generation_time_ms: number;
  prompt_template_id: string | null;
  ai_settings_id: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  entity: string;
  entity_id: string | null;
  action: string;
  metadata: Record<string, any>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}
