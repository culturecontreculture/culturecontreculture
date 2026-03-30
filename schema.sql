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
--  Permissions explicites pour le rôle anon
-- -------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON content_blocks TO anon;

-- -------------------------------------------------------------
--  Row Level Security
-- -------------------------------------------------------------
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_all" ON content_blocks;
CREATE POLICY "anon_all"
  ON content_blocks
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- -------------------------------------------------------------
--  Storage buckets + policies (tout en SQL, pas besoin du dashboard)
-- -------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('photos', 'photos', true, 20971520, ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('audio',  'audio',  true, 52428800, ARRAY['audio/mpeg','audio/mp3','audio/wav','audio/ogg','audio/mp4'])
ON CONFLICT (id) DO NOTHING;

-- Policies storage : lecture publique
DROP POLICY IF EXISTS "photos_public_read"  ON storage.objects;
DROP POLICY IF EXISTS "audio_public_read"   ON storage.objects;
CREATE POLICY "photos_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'photos');
CREATE POLICY "audio_public_read"  ON storage.objects FOR SELECT USING (bucket_id = 'audio');

-- Policies storage : écriture anon (protégée par le mot de passe admin côté frontend)
DROP POLICY IF EXISTS "photos_anon_write" ON storage.objects;
DROP POLICY IF EXISTS "audio_anon_write"  ON storage.objects;
CREATE POLICY "photos_anon_write" ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'photos');
CREATE POLICY "audio_anon_write"  ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'audio');

DROP POLICY IF EXISTS "photos_anon_update" ON storage.objects;
DROP POLICY IF EXISTS "audio_anon_update"  ON storage.objects;
CREATE POLICY "photos_anon_update" ON storage.objects FOR UPDATE TO anon USING (bucket_id = 'photos');
CREATE POLICY "audio_anon_update"  ON storage.objects FOR UPDATE TO anon USING (bucket_id = 'audio');

DROP POLICY IF EXISTS "photos_anon_delete" ON storage.objects;
DROP POLICY IF EXISTS "audio_anon_delete"  ON storage.objects;
CREATE POLICY "photos_anon_delete" ON storage.objects FOR DELETE TO anon USING (bucket_id = 'photos');
CREATE POLICY "audio_anon_delete"  ON storage.objects FOR DELETE TO anon USING (bucket_id = 'audio');
