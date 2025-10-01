const { executeQuery } = require('../config/turso');

class Verse {
  /**
   * Get all verses
   */
  static async getAll() {
    try {
      const result = await executeQuery(`
        SELECT v.*, c.chapter_number, c.title_english as chapter_title
        FROM verses v
        JOIN chapters c ON v.chapter_id = c.id
        ORDER BY c.chapter_number, v.verse_number
      `);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch verses: ${error.message}`);
    }
  }

  /**
   * Get verse by ID
   */
  static async getById(id) {
    try {
      const result = await executeQuery(`
        SELECT v.*, c.chapter_number, c.title_english as chapter_title
        FROM verses v
        JOIN chapters c ON v.chapter_id = c.id
        WHERE v.id = ?
      `, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch verse: ${error.message}`);
    }
  }

  /**
   * Get verses by chapter ID
   */
  static async getByChapterId(chapterId) {
    try {
      const result = await executeQuery(
        'SELECT * FROM verses WHERE chapter_id = ? ORDER BY verse_number ASC',
        [chapterId]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch verses: ${error.message}`);
    }
  }

  /**
   * Get specific verse by chapter number and verse number
   */
  static async getByChapterAndVerse(chapterNumber, verseNumber) {
    try {
      const result = await executeQuery(`
        SELECT v.*, c.chapter_number, c.title_english as chapter_title
        FROM verses v
        JOIN chapters c ON v.chapter_id = c.id
        WHERE c.chapter_number = ? AND v.verse_number = ?
      `, [chapterNumber, verseNumber]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch verse: ${error.message}`);
    }
  }

  /**
   * Create a new verse
   */
  static async create(verseData) {
    try {
      const result = await executeQuery(
        `INSERT INTO verses 
         (chapter_id, verse_number, sanskrit_text, transliteration, word_meanings, 
          translation_english, purport) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          verseData.chapter_id,
          verseData.verse_number,
          verseData.sanskrit_text,
          verseData.transliteration || null,
          verseData.word_meanings || null,
          verseData.translation_english,
          verseData.purport || null
        ]
      );
      return { id: result.lastInsertRowid };
    } catch (error) {
      throw new Error(`Failed to create verse: ${error.message}`);
    }
  }

  /**
   * Update a verse
   */
  static async update(id, verseData) {
    try {
      await executeQuery(
        `UPDATE verses 
         SET sanskrit_text = ?,
             transliteration = ?,
             word_meanings = ?,
             translation_english = ?,
             purport = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [
          verseData.sanskrit_text,
          verseData.transliteration || null,
          verseData.word_meanings || null,
          verseData.translation_english,
          verseData.purport || null,
          id
        ]
      );
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to update verse: ${error.message}`);
    }
  }

  /**
   * Delete a verse
   */
  static async delete(id) {
    try {
      await executeQuery('DELETE FROM verses WHERE id = ?', [id]);
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete verse: ${error.message}`);
    }
  }

  /**
   * Search verses by text
   */
  static async search(searchTerm) {
    try {
      const result = await executeQuery(`
        SELECT v.*, c.chapter_number, c.title_english as chapter_title
        FROM verses v
        JOIN chapters c ON v.chapter_id = c.id
        WHERE v.sanskrit_text LIKE ? 
           OR v.transliteration LIKE ?
           OR v.translation_english LIKE ?
           OR v.purport LIKE ?
        ORDER BY c.chapter_number, v.verse_number
      `, [
        `%${searchTerm}%`,
        `%${searchTerm}%`,
        `%${searchTerm}%`,
        `%${searchTerm}%`
      ]);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to search verses: ${error.message}`);
    }
  }

  /**
   * Get random verse (Verse of the Day)
   */
  static async getRandom() {
    try {
      const result = await executeQuery(`
        SELECT v.*, c.chapter_number, c.title_english as chapter_title
        FROM verses v
        JOIN chapters c ON v.chapter_id = c.id
        ORDER BY RANDOM()
        LIMIT 1
      `);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch random verse: ${error.message}`);
    }
  }

  /**
   * Get verse count by chapter
   */
  static async getCountByChapter(chapterId) {
    try {
      const result = await executeQuery(
        'SELECT COUNT(*) as count FROM verses WHERE chapter_id = ?',
        [chapterId]
      );
      return result.rows[0].count;
    } catch (error) {
      throw new Error(`Failed to count verses: ${error.message}`);
    }
  }
}

module.exports = Verse;
