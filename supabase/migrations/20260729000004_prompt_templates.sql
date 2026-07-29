-- ========================================================
-- SCHEMA - ENTIDADE: prompt_templates
-- Migration: 20260729000004_prompt_templates.sql
-- ========================================================

CREATE TABLE IF NOT EXISTS public.prompt_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    description TEXT,
    system_prompt TEXT NOT NULL,
    user_prompt TEXT NOT NULL,
    created_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT null,
    
    CONSTRAINT fk_prompt_templates_created_by FOREIGN KEY (created_by)
        REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Habilitar RLS
ALTER TABLE public.prompt_templates ENABLE ROW LEVEL SECURITY;

-- Índices padronizados
CREATE INDEX IF NOT EXISTS idx_prompt_templates_deleted_at ON public.prompt_templates(deleted_at);

-- Políticas RLS
CREATE POLICY "Permitir leitura de prompt_templates para autenticados"
    ON public.prompt_templates FOR SELECT TO authenticated
    USING (deleted_at IS NULL);

CREATE POLICY "Permitir modificação de prompt_templates apenas para admins"
    ON public.prompt_templates FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
