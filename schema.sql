-- ====================================================================
-- COSMOS OS — SUPABASE SCHEMA CONFIGURATION
-- Run this in the Supabase SQL Editor (https://supabase.com)
-- ====================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_data Table
CREATE TABLE IF NOT EXISTS public.user_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    realm VARCHAR(255) NOT NULL,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE (user_id, realm)
);

-- Indexing for Faster Query and Sync Lookups
CREATE INDEX IF NOT EXISTS idx_user_data_user_id ON public.user_data(user_id);
CREATE INDEX IF NOT EXISTS idx_user_data_realm ON public.user_data(realm);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_data ENABLE ROW LEVEL SECURITY;

-- Row Level Security (RLS) Policies
-- Ensure users can only read/write their own synchronized data

-- 1. Select Policy
CREATE POLICY "Users can view their own data"
ON public.user_data
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 2. Insert Policy
CREATE POLICY "Users can insert their own data"
ON public.user_data
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 3. Update Policy
CREATE POLICY "Users can update their own data"
ON public.user_data
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. Delete Policy
CREATE POLICY "Users can delete their own data"
ON public.user_data
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Trigger for Auto-Updating updated_at Timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create Trigger
DROP TRIGGER IF EXISTS trigger_user_data_updated_at ON public.user_data;
CREATE TRIGGER trigger_user_data_updated_at
    BEFORE UPDATE ON public.user_data
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
