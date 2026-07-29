-- ========================================================
-- SCHEMA - ENTIDADE: ai_models
-- Migration: 20260729000001_ai_models.sql
-- ========================================================

CREATE TABLE IF NOT EXISTS public.ai_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL,
    model_name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    api_identifier TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_deprecated BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT null,
    
    CONSTRAINT uq_ai_models_api_identifier UNIQUE (api_identifier)
);

-- Habilitar RLS
ALTER TABLE public.ai_models ENABLE ROW LEVEL SECURITY;

-- Índices padronizados
CREATE INDEX IF NOT EXISTS idx_ai_models_deleted_at ON public.ai_models(deleted_at);

-- Políticas RLS
CREATE POLICY "Permitir leitura de ai_models para autenticados"
    ON public.ai_models FOR SELECT TO authenticated
    USING (deleted_at IS NULL);

CREATE POLICY "Permitir modificação de ai_models apenas para admins"
    ON public.ai_models FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
