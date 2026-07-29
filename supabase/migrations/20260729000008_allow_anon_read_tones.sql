-- ========================================================
-- SCHEMA - PERMISSÃO ANON: excuse_tones
-- Migration: 20260729000008_allow_anon_read_tones.sql
-- ========================================================

CREATE POLICY "Permitir leitura de excuse_tones para anonimos"
    ON public.excuse_tones FOR SELECT TO anon
    USING (deleted_at IS NULL AND is_active = true);
