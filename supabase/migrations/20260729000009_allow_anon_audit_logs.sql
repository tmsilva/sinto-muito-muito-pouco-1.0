-- ========================================================
-- SCHEMA - PERMISSÃO ANON: audit_logs
-- Migration: 20260729000009_allow_anon_audit_logs.sql
-- ========================================================

CREATE POLICY "Permitir inserção de audit_logs para anonimos"
    ON public.audit_logs FOR INSERT TO anon
    WITH CHECK (user_id IS NULL);
