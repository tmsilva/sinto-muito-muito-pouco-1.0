-- ========================================================
-- SCHEMA - ENTIDADE: excuse_tones
-- Migration: 20260729000003_excuse_tones.sql
-- ========================================================

CREATE TABLE IF NOT EXISTS public.excuse_tones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT null,
    
    CONSTRAINT uq_excuse_tones_name UNIQUE (name)
);

-- Habilitar RLS
ALTER TABLE public.excuse_tones ENABLE ROW LEVEL SECURITY;

-- Índices padronizados
CREATE INDEX IF NOT EXISTS idx_excuse_tones_deleted_at ON public.excuse_tones(deleted_at);

-- Políticas RLS
CREATE POLICY "Permitir leitura de excuse_tones para autenticados"
    ON public.excuse_tones FOR SELECT TO authenticated
    USING (deleted_at IS NULL);

CREATE POLICY "Permitir modificação de excuse_tones apenas para admins"
    ON public.excuse_tones FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
