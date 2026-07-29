-- ========================================================
-- SCHEMA - ENTIDADE: audit_logs
-- Migration: 20260729000007_audit_logs.sql
-- ========================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    entity TEXT NOT NULL,
    entity_id UUID,
    action TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT fk_audit_logs_user FOREIGN KEY (user_id)
        REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Habilitar RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Índices padronizados
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);

-- Políticas RLS
CREATE POLICY "Permitir leitura de audit_logs apenas para admins"
    ON public.audit_logs FOR SELECT TO authenticated
    USING (public.is_admin());

CREATE POLICY "Permitir inserção de audit_logs para autenticados"
    ON public.audit_logs FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id OR public.is_admin());
