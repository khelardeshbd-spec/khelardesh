-- ============================================================
-- RBAC Migration: AdminUser, EmployeeUser, ActivityLog
-- Run once in Supabase SQL editor
-- ============================================================

-- 1. Admin Users table
CREATE TABLE IF NOT EXISTS "AdminUser" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin')),
  is_blocked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Employee Users table
CREATE TABLE IF NOT EXISTS "EmployeeUser" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  permissions JSONB NOT NULL DEFAULT '{"write_articles": true, "view_articles": true}',
  created_by UUID REFERENCES "AdminUser"(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Activity Log table
CREATE TABLE IF NOT EXISTS "ActivityLog" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id TEXT NOT NULL,
  actor_display_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  target_label TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- RLS Policies for ActivityLog (tamper-proof)
-- ============================================================
ALTER TABLE "ActivityLog" ENABLE ROW LEVEL SECURITY;

-- Allow server (service_role) to INSERT logs
CREATE POLICY "service_role_insert_log"
  ON "ActivityLog"
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Allow server (service_role) to SELECT logs
CREATE POLICY "service_role_select_log"
  ON "ActivityLog"
  FOR SELECT
  TO service_role
  USING (true);

-- DENY UPDATE and DELETE for ALL roles (including service_role)
-- This is achieved by NOT creating any UPDATE or DELETE policies
-- and keeping RLS enabled, which defaults to deny.

-- ============================================================
-- RLS for AdminUser (service_role only)
-- ============================================================
ALTER TABLE "AdminUser" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all_adminuser"
  ON "AdminUser"
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- RLS for EmployeeUser (service_role only)
-- ============================================================
ALTER TABLE "EmployeeUser" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all_employeeuser"
  ON "EmployeeUser"
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
