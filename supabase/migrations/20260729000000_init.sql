-- ========================================================
-- SCHEMA INICIAL - PROJETO: Sinto Muito (Muito Pouco)
-- Migration: 20260729000000_init.sql
-- ========================================================

-- 1. Tabela de Perfis (perfis de usuários)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    updated_at TIMESTAMPTZ,
    full_name TEXT,
    avatar_url TEXT,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS para profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para profiles
CREATE POLICY "Permitir leitura pública ou para autenticados"
    ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Permitir inserção pelo próprio usuário"
    ON public.profiles FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Permitir atualização pelo próprio usuário"
    ON public.profiles FOR UPDATE TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);


-- 2. Tabela de Papéis (Roles)
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS para roles
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para roles
CREATE POLICY "Permitir leitura de roles para autenticados"
    ON public.roles FOR SELECT TO authenticated USING (true);


-- 3. Tabela de Papéis de Usuários (User Roles)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, role_id)
);

-- Habilitar RLS para user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;


-- 4. Função helper para verificar se o usuário é administrador (is_admin)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.name = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Políticas de RLS para user_roles
CREATE POLICY "Permitir leitura das próprias roles ou por admin"
    ON public.user_roles FOR SELECT TO authenticated
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Permitir inserção de user_roles apenas por admin"
    ON public.user_roles FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "Permitir exclusão de user_roles apenas por admin"
    ON public.user_roles FOR DELETE TO authenticated
    USING (public.is_admin());


-- Adicionar políticas de modificação em roles para admin
CREATE POLICY "Permitir inserção de roles apenas por admin"
    ON public.roles FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "Permitir atualização de roles apenas por admin"
    ON public.roles FOR UPDATE TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Permitir exclusão de roles apenas por admin"
    ON public.roles FOR DELETE TO authenticated
    USING (public.is_admin());
