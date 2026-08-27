-- 1. Create avatar_config table
CREATE TABLE IF NOT EXISTS public.avatar_config (
    user_id TEXT NOT NULL,
    avatar_id TEXT NOT NULL,
    name TEXT NOT NULL,
    profession TEXT,
    relationship TEXT,
    tone TEXT,
    traits JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id, avatar_id)
);

-- 2. Alter avatar_config to add voice/face status columns if they do not exist
-- Note: ADD COLUMN IF NOT EXISTS is supported in modern PostgreSQL (PostgreSQL 9.6+), which matches Supabase.
ALTER TABLE public.avatar_config ADD COLUMN IF NOT EXISTS voice_complete BOOLEAN DEFAULT false NOT NULL;
ALTER TABLE public.avatar_config ADD COLUMN IF NOT EXISTS face_complete BOOLEAN DEFAULT false NOT NULL;
ALTER TABLE public.avatar_config ADD COLUMN IF NOT EXISTS voice_sample_url TEXT;
ALTER TABLE public.avatar_config ADD COLUMN IF NOT EXISTS face_sample_url TEXT;

-- 3. Create brain_output table
CREATE TABLE IF NOT EXISTS public.brain_output (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    avatar_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    turn_id TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    response_text TEXT,
    sentiment_emotion JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create indexes for brain_output
CREATE INDEX IF NOT EXISTS brain_output_session_idx ON public.brain_output(session_id);
CREATE INDEX IF NOT EXISTS brain_output_user_avatar_idx ON public.brain_output(user_id, avatar_id);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.avatar_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brain_output ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies
-- IMPORTANT / WARNING:
-- These policies are currently set to permissive for development and service_role integrations.
-- Once real per-user RLS is needed for frontend-direct client queries, you MUST tighten these policies.
-- For example, update the policy condition to: auth.uid() = user_id (if user_id maps directly to Supabase auth.users.id).

DROP POLICY IF EXISTS "Permissive policy for avatar_config" ON public.avatar_config;
CREATE POLICY "Permissive policy for avatar_config" ON public.avatar_config
    FOR ALL
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Permissive policy for brain_output" ON public.brain_output;
CREATE POLICY "Permissive policy for brain_output" ON public.brain_output
    FOR ALL
    USING (true)
    WITH CHECK (true);
