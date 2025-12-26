-- Create new reflections table
CREATE TABLE IF NOT EXISTS reflections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  reflection_text TEXT NOT NULL,
  verse_id INTEGER,
  chapter_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (verse_id) REFERENCES verses(id) ON DELETE SET NULL,
  FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE SET NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_reflections_user_id ON reflections(user_id);
CREATE INDEX IF NOT EXISTS idx_reflections_verse_id ON reflections(verse_id);
CREATE INDEX IF NOT EXISTS idx_reflections_chapter_id ON reflections(chapter_id);

-- Drop the old items table if it exists
DROP TABLE IF EXISTS items;
