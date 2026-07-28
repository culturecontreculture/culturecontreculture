-- =============================================================
--  Culture contre Culture — "Trois" (page 3 colonnes)
--  Table dédiée : trois_blocks — n'affecte pas content_blocks
--  À exécuter dans le SQL editor Supabase (déjà appliqué via MCP)
-- =============================================================

CREATE TABLE IF NOT EXISTS trois_blocks (
  id          TEXT        PRIMARY KEY,
  type        TEXT        NOT NULL CHECK (type IN ('audio', 'text', 'photo', 'youtube', 'title')),
  col         TEXT        NOT NULL CHECK (col IN ('news', 'c1', 'c2', 'c3')),
  content     TEXT,
  visible     BOOLEAN     NOT NULL DEFAULT false,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Réutilise la fonction update_updated_at() créée par schema.sql racine
DROP TRIGGER IF EXISTS set_updated_at ON trois_blocks;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON trois_blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- -------------------------------------------------------------
--  Seed : news + 5 blocs par colonne
--  Les titres reprennent le visuel de référence pour les tests
-- -------------------------------------------------------------
INSERT INTO trois_blocks (id, type, col, content, visible) VALUES
  ('news_text',  'text',    'news', 'Les Maudits — l''album est disponible. La tournée des Maudits, Acte I, traversera la France en 2027. Radio France Résistance émet chaque soir à la nuit tombée.', true),

  ('c1_title',   'title',   'c1', 'FRANCE 2027',            true),
  ('c1_sub',     'text',    'c1', 'La tournée des Maudits — Acte I', true),
  ('c1_photo',   'photo',   'c1', NULL, false),
  ('c1_youtube', 'youtube', 'c1', NULL, false),
  ('c1_audio',   'audio',   'c1', NULL, false),

  ('c2_title',   'title',   'c2', 'MÉLANCOLIE WHISKY',      true),
  ('c2_sub',     'text',    'c2', NULL, false),
  ('c2_photo',   'photo',   'c2', NULL, false),
  ('c2_youtube', 'youtube', 'c2', 'hu-ZxnbivT0', true),
  ('c2_audio',   'audio',   'c2', NULL, false),

  ('c3_title',   'title',   'c3', 'LA TRAGÉDIE DE PARIS',   true),
  ('c3_sub',     'text',    'c3', 'Les Maudits l''album / Le Concert du Siècle', true),
  ('c3_photo',   'photo',   'c3', NULL, false),
  ('c3_youtube', 'youtube', 'c3', NULL, false),
  ('c3_audio',   'audio',   'c3', NULL, false)
ON CONFLICT (id) DO NOTHING;

-- -------------------------------------------------------------
--  Permissions + RLS (mêmes règles que content_blocks)
-- -------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON trois_blocks TO anon;

ALTER TABLE trois_blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_all" ON trois_blocks;
CREATE POLICY "anon_all"
  ON trois_blocks
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);
