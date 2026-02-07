-- Migration: Initial Schema for Sunuboutique
-- Description: Create profiles and shops tables with RLS and indexes.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nom_complet TEXT NOT NULL,
    telephone TEXT UNIQUE,
    plan TEXT DEFAULT 'Gratuit' CHECK (plan IN ('Gratuit', 'Standard', 'Premium')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. SHOPS TABLE
CREATE TABLE IF NOT EXISTS public.shops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    nom_boutique TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. INDEXES
CREATE INDEX IF NOT EXISTS idx_profiles_telephone ON public.profiles(telephone);
CREATE INDEX IF NOT EXISTS idx_shops_user_id ON public.shops(user_id);
CREATE INDEX IF NOT EXISTS idx_shops_slug ON public.shops(slug);

-- 4. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Shops Policies
CREATE POLICY "Shops are viewable by everyone" 
ON public.shops FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own shop" 
ON public.shops FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shop" 
ON public.shops FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shop" 
ON public.shops FOR DELETE 
USING (auth.uid() = user_id);

-- 5. TRIGGER FOR UPDATED_AT
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_shops_updated_at
BEFORE UPDATE ON public.shops
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- 6. TRIGGER ON AUTH.USERS FOR AUTOMATIC PROFILE CREATION (Optional but recommended)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, nom_complet, telephone, plan)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'nom_complet', ''), 
    COALESCE(new.raw_user_meta_data->>'telephone', ''),
    'Gratuit'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();