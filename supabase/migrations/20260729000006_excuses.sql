-- ========================================================
-- SCHEMA - ENTIDADE: excuses
-- Migration: 20260729000006_excuses.sql
-- ========================================================

CREATE TABLE IF NOT EXISTS public.excuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    input_context TEXT NOT NULL,
    generated_text TEXT NOT NULL,
    tone_id UUID,
    model_id UUID,
    used_temperature NUMERIC NOT NULL,
    used_max_tokens INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'success',
    favorite BOOLEAN NOT NULL DEFAULT false,
    generation_time_ms INTEGER NOT NULL DEFAULT 0,
    prompt_template_id UUID,
    ai_settings_id UUID,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT null,
    
    CONSTRAINT fk_excuses_user FOREIGN KEY (user_id)
        REFERENCES auth.users(id) ON DELETE SET NULL,
    CONSTRAINT fk_excuses_tone FOREIGN KEY (tone_id)
        REFERENCES public.excuse_tones(id) ON DELETE SET NULL,
    CONSTRAINT fk_excuses_model FOREIGN KEY (model_id)
        REFERENCES public.ai_models(id) ON DELETE SET NULL,
    CONSTRAINT fk_excuses_prompt_template FOREIGN KEY (prompt_template_id)
        REFERENCES public.prompt_templates(id) ON DELETE SET NULL,
    CONSTRAINT fk_excuses_ai_settings FOREIGN KEY (ai_settings_id)
        REFERENCES public.ai_settings(id) ON DELETE SET NULL
);

-- Habilitar RLS
ALTER TABLE public.excuses ENABLE ROW LEVEL SECURITY;

-- Índices padronizados e de otimização de consultas
CREATE INDEX IF NOT EXISTS idx_excuses_deleted_at ON public.excuses(deleted_at);
CREATE INDEX IF NOT EXISTS idx_excuses_user_id ON public.excuses(user_id);

-- Políticas RLS
CREATE POLICY "Permitir leitura de excuses próprias ou para admin"
    ON public.excuses FOR SELECT TO authenticated
    USING ((auth.uid() = user_id OR public.is_admin()) AND deleted_at IS NULL);

CREATE POLICY "Permitir inserção de excuses próprias ou para admin"
    ON public.excuses FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Permitir atualização de excuses próprias ou para admin"
    ON public.excuses FOR UPDATE TO authenticated
    USING ((auth.uid() = user_id OR public.is_admin()) AND deleted_at IS NULL)
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Permitir exclusão de excuses próprias ou para admin"
    ON public.excuses FOR DELETE TO authenticated
    USING (auth.uid() = user_id OR public.is_admin());
