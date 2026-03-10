-- AI Assist SMEs - Complete Database Schema
-- This schema matches EXACTLY what the application code expects
-- Run this in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  company TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- 2. SUBSCRIPTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT DEFAULT 'free',
  status TEXT DEFAULT 'inactive',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- 3. CLIENTS
-- Code uses: name, email, phone, company, status, notes, tags, total_revenue, last_contact
-- ============================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  status TEXT DEFAULT 'active',
  notes TEXT,
  tags TEXT[],
  total_revenue NUMERIC(10,2) DEFAULT 0,
  last_contact TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);

-- ============================================
-- 4. LEADS
-- Code uses: name, email, phone, company, status, source, value, notes, score
-- Stats route uses: .neq('status', 'converted') — NOT 'stage'
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  source TEXT DEFAULT 'manual',
  status TEXT DEFAULT 'new',
  score INTEGER DEFAULT 0,
  notes TEXT,
  value NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);

-- ============================================
-- 5. APPOINTMENTS
-- Code uses: client_name, client_email, client_phone, service, appointment_date,
--            appointment_time, duration, notes, status
-- Stats route uses: .eq('appointment_date', todayStr) — expects TEXT date column
-- ============================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  service TEXT,
  appointment_date TEXT NOT NULL,
  appointment_time TEXT NOT NULL,
  duration INTEGER DEFAULT 30,
  notes TEXT,
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);

-- ============================================
-- 6. AUTOMATIONS
-- Code uses: name, type, trigger_event, action_description, is_active
-- Stats route uses: .eq('is_active', true)
-- ============================================
CREATE TABLE IF NOT EXISTS automations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'lead_response',
  trigger_event TEXT DEFAULT 'new_lead',
  action_description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_run TIMESTAMPTZ,
  run_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_automations_user_id ON automations(user_id);

-- ============================================
-- 7. ACTIVITIES
-- Code uses: type, title, description, metadata
-- ============================================
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  related_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_created ON activities(created_at DESC);

-- ============================================
-- 8. KNOWLEDGE BASE
-- ============================================
CREATE TABLE IF NOT EXISTS knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  tags TEXT[],
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_kb_user_id ON knowledge_base(user_id);

-- ============================================
-- 9. USER SETTINGS
-- ============================================
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notifications_email BOOLEAN DEFAULT TRUE,
  notifications_sms BOOLEAN DEFAULT FALSE,
  notifications_push BOOLEAN DEFAULT TRUE,
  notifications_marketing BOOLEAN DEFAULT FALSE,
  theme TEXT DEFAULT 'system',
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'Europe/London',
  api_keys JSONB DEFAULT '{}',
  integrations JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- 10. MESSAGES (chat history)
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);

-- ============================================
-- 11. CONTACT SUBMISSIONS
-- ============================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  service TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Subscriptions
DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Service role manages subscriptions" ON subscriptions;
CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role manages subscriptions" ON subscriptions FOR ALL USING (true);

-- Clients
DROP POLICY IF EXISTS "Users CRUD own clients" ON clients;
CREATE POLICY "Users CRUD own clients" ON clients FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Leads
DROP POLICY IF EXISTS "Users CRUD own leads" ON leads;
CREATE POLICY "Users CRUD own leads" ON leads FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Appointments
DROP POLICY IF EXISTS "Users CRUD own appointments" ON appointments;
CREATE POLICY "Users CRUD own appointments" ON appointments FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Automations
DROP POLICY IF EXISTS "Users CRUD own automations" ON automations;
CREATE POLICY "Users CRUD own automations" ON automations FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Activities
DROP POLICY IF EXISTS "Users manage own activities" ON activities;
CREATE POLICY "Users manage own activities" ON activities FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Knowledge Base
DROP POLICY IF EXISTS "Users CRUD own kb" ON knowledge_base;
CREATE POLICY "Users CRUD own kb" ON knowledge_base FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- User Settings
DROP POLICY IF EXISTS "Users manage own settings" ON user_settings;
CREATE POLICY "Users manage own settings" ON user_settings FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Messages
DROP POLICY IF EXISTS "Users manage own messages" ON messages;
CREATE POLICY "Users manage own messages" ON messages FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Contact Submissions (public insert, service role read)
DROP POLICY IF EXISTS "Anyone can submit" ON contact_submissions;
DROP POLICY IF EXISTS "Service role reads contacts" ON contact_submissions;
CREATE POLICY "Anyone can submit" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role reads contacts" ON contact_submissions FOR SELECT USING (true);

-- ============================================
-- AUTO-UPDATE updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'profiles','subscriptions','clients','leads',
    'appointments','automations','knowledge_base','user_settings'
  ]) LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS update_%s_updated_at ON %s', t, t);
    EXECUTE format('CREATE TRIGGER update_%s_updated_at BEFORE UPDATE ON %s FOR EACH ROW EXECUTE FUNCTION update_updated_at()', t, t);
  END LOOP;
END $$;
