-- =============================================================
--  Culture contre Culture — Supabase Schema
--  Run this in the Supabase SQL editor
-- =============================================================

-- -------------------------------------------------------------
--  Table: content_blocks
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS content_blocks (
  id          TEXT        PRIMARY KEY,
  type        TEXT        NOT NULL CHECK (type IN ('audio', 'text', 'photo', 'youtube')),
  col         TEXT        NOT NULL CHECK (col IN ('left', 'right')),
  content     TEXT,
  visible     BOOLEAN     NOT NULL DEFAULT false,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON content_blocks;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON content_blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- -------------------------------------------------------------
--  Seed: 8 canonical rows
-- -------------------------------------------------------------
INSERT INTO content_blocks (id, type, col, content, visible) VALUES
  ('left_audio',   'audio',   'left',  NULL,           false),
  ('left_text',    'text',    'left',  NULL,           false),
  ('left_photo',   'photo',   'left',  NULL,           false),
  ('left_youtube', 'youtube', 'left',  NULL,           false),
  ('right_audio',  'audio',   'right', NULL,           false),
  ('right_text',   'text',    'right', NULL,           false),
  ('right_photo',  'photo',   'right', NULL,           false),
  ('right_youtube','youtube', 'right', 'hu-ZxnbivT0',  true )
ON CONFLICT (id) DO NOTHING;

-- -------------------------------------------------------------
--  Row Level Security
-- -------------------------------------------------------------
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;

-- Allow full access for anonymous role
-- (frontend password in admin.html provides the security layer)
DROP POLICY IF EXISTS "anon_all" ON content_blocks;
CREATE POLICY "anon_all"
  ON content_blocks
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- -------------------------------------------------------------
--  Storage buckets — CREATE MANUALLY in Supabase dashboard
-- -------------------------------------------------------------
-- 1. Go to Storage > New bucket
--    Name: photos
--    Public: YES
--    Allowed MIME types: image/*
--    Max file size: 20 MB
--
-- 2. Go to Storage > New bucket
--    Name: audio
--    Public: YES
--    Allowed MIME types: audio/*
--    Max file size: 50 MB
--
-- Then add a storage policy for each bucket:
--    Allowed operation: INSERT, SELECT, UPDATE, DELETE
--    Role: anon
--    Policy definition: true
-- -------------------------------------------------------------
