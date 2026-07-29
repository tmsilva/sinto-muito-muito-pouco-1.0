-- ========================================================
-- SCHEMA - PERMISSÃO COMPLETA DE INSERÇÃO: audit_logs
-- Migration: 20260729000010_fix_audit_logs_rls.sql
-- ========================================================

-- Remover políticas antigas de inserção em audit_logs
DROP POLICY IF EXISTS "Permitir inserção de audit_logs para autenticados" ON public.audit_logs;
DROP POLICY IF EXISTS "Permitir inserção de audit_logs para anonimos" ON public.audit_logs;

-- Criar política para permitir inserção de logs por qualquer origem (autenticado ou anônimo)
CREATE POLICY "Permitir inserção de audit_logs para todos"
    ON public.audit_logs FOR INSERT
    TO public
    WITH CHECK (true);
