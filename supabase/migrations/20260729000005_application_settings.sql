-- ========================================================
-- SCHEMA - ENTIDADE: application_settings
-- Migration: 20260729000005_application_settings.sql
-- ========================================================

CREATE TABLE IF NOT EXISTS public.application_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'string',
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT null,
    
    CONSTRAINT uq_application_settings_key UNIQUE (key)
);

-- Habilitar RLS
ALTER TABLE public.application_settings ENABLE ROW LEVEL SECURITY;

-- Índices padronizados
CREATE INDEX IF NOT EXISTS idx_application_settings_deleted_at ON public.application_settings(deleted_at);

-- Políticas RLS
CREATE POLICY "Permitir leitura de application_settings para autenticados"
    ON public.application_settings FOR SELECT TO authenticated
    USING (deleted_at IS NULL);

CREATE POLICY "Permitir modificação de application_settings apenas para admins"
    ON public.application_settings FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
