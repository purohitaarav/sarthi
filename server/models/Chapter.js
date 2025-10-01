const { executeQuery } = require('../config/turso');

class Chapter {
  /**
   * Get all chapters
   */
  static async getAll() {
    try {
      const result = await executeQuery(
        'SELECT * FROM chapters ORDER BY chapter_number ASC'
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch chapters: ${error.message}`);
    }
  }

  /**
   * Get chapter by ID
   */
  static async getById(id) {
    try {
      const result = await executeQuery(
        'SELECT * FROM chapters WHERE id = ?',
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch chapter: ${error.message}`);
    }
  }

  /**
   * Get chapter by chapter number
   */
  static async getByChapterNumber(chapterNumber) {
    try {
      const result = await executeQuery(
        'SELECT * FROM chapters WHERE chapter_number = ?',
        [chapterNumber]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch chapter: ${error.message}`);
    }
  }

  /**
   * Create a new chapter
   */
  static async create(chapterData) {
    try {
      const result = await executeQuery(
        `INSERT INTO chapters 
         (chapter_number, title_sanskrit, title_english, title_transliteration, summary, verse_count) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          chapterData.chapter_number,
          chapterData.title_sanskrit,
          chapterData.title_english,
          chapterData.title_transliteration || null,
          chapterData.summary || null,
          chapterData.verse_count || 0
        ]
      );
      return { id: result.lastInsertRowid };
    } catch (error) {
      throw new Error(`Failed to create chapter: ${error.message}`);
    }
  }

  /**
   * Update a chapter
   */
  static async update(id, chapterData) {
    try {
      await executeQuery(
        `UPDATE chapters 
         SET title_sanskrit = ?, 
             title_english = ?, 
             title_transliteration = ?, 
             summary = ?, 
             verse_count = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [
          chapterData.title_sanskrit,
          chapterData.title_english,
          chapterData.title_transliteration || null,
          chapterData.summary || null,
          chapterData.verse_count || 0,
          id
        ]
      );
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to update chapter: ${error.message}`);
    }
  }

  /**
   * Delete a chapter
   */
  static async delete(id) {
    try {
      await executeQuery('DELETE FROM chapters WHERE id = ?', [id]);
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete chapter: ${error.message}`);
    }
  }

  /**
   * Get chapter with all its verses
   */
  static async getWithVerses(chapterNumber) {
    try {
      const chapter = await this.getByChapterNumber(chapterNumber);
      if (!chapter) {
        return null;
      }

      const versesResult = await executeQuery(
        'SELECT * FROM verses WHERE chapter_id = ? ORDER BY verse_number ASC',
        [chapter.id]
      );

      return {
        ...chapter,
        verses: versesResult.rows
      };
    } catch (error) {
      throw new Error(`Failed to fetch chapter with verses: ${error.message}`);
    }
  }

  /**
   * Get chapter statistics
   */
  static async getStats() {
    try {
      const result = await executeQuery(`
        SELECT 
          COUNT(*) as total_chapters,
          SUM(verse_count) as total_verses
        FROM chapters
      `);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to fetch chapter stats: ${error.message}`);
    }
  }
}

module.exports = Chapter;
