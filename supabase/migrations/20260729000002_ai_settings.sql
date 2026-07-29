-- ========================================================
-- SCHEMA - ENTIDADE: ai_settings
-- Migration: 20260729000002_ai_settings.sql
-- ========================================================

CREATE TABLE IF NOT EXISTS public.ai_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    default_model_id UUID,
    temperature NUMERIC NOT NULL DEFAULT 0.7,
    max_tokens INTEGER NOT NULL DEFAULT 1000,
    timeout_ms INTEGER NOT NULL DEFAULT 30000,
    system_prompt TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT null,
    
    CONSTRAINT fk_ai_settings_default_model FOREIGN KEY (default_model_id) 
        REFERENCES public.ai_models(id) ON DELETE SET NULL
);

-- Habilitar RLS
ALTER TABLE public.ai_settings ENABLE ROW LEVEL SECURITY;

-- Índices padronizados
CREATE INDEX IF NOT EXISTS idx_ai_settings_deleted_at ON public.ai_settings(deleted_at);

-- Políticas RLS
CREATE POLICY "Permitir leitura de ai_settings para autenticados"
    ON public.ai_settings FOR SELECT TO authenticated
    USING (deleted_at IS NULL);

CREATE POLICY "Permitir modificação de ai_settings apenas para admins"
    ON public.ai_settings FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
