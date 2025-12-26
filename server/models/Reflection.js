const db = require('../config/database');

class Reflection {
  // Create a new reflection
  static create(reflectionData, callback) {
    const { user_id, reflection_text, verse_id, chapter_id } = reflectionData;
    const sql = `
      INSERT INTO reflections (user_id, reflection_text, verse_id, chapter_id)
      VALUES (?, ?, ?, ?)
    `;

    db.run(sql, [user_id, reflection_text, verse_id, chapter_id], function (err) {
      if (err) return callback(err);
      this.getById(this.lastID, (err, reflection) => {
        callback(err, reflection);
      });
    });
  }

  // Get reflection by ID with related data
  static getById(id, callback) {
    const sql = `
      SELECT r.*, 
             v.verse_number, 
             c.chapter_number,
             c.title_english as chapter_title
      FROM reflections r
      LEFT JOIN gita.verses v ON r.verse_id = v.id
      LEFT JOIN gita.chapters c ON r.chapter_id = c.id OR v.chapter_id = c.id
      WHERE r.id = ?
    `;
    db.get(sql, [id], callback);
  }

  // Get all reflections for a user
  static getByUserId(userId, callback) {
    const sql = `
      SELECT r.*, 
             v.verse_number, 
             c.chapter_number,
             c.title_english as chapter_title
      FROM reflections r
      LEFT JOIN gita.verses v ON r.verse_id = v.id
      LEFT JOIN gita.chapters c ON r.chapter_id = c.id OR v.chapter_id = c.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `;
    db.all(sql, [userId], callback);
  }

  // Update a reflection
  static update(id, reflectionData, callback) {
    const { reflection_text } = reflectionData;
    const sql = `
      UPDATE reflections 
      SET reflection_text = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    db.run(sql, [reflection_text, id], function (err) {
      if (err) return callback(err);
      this.getById(id, callback);
    }.bind({ getById: this.getById }));
  }

  // Delete a reflection
  static delete(id, callback) {
    const sql = 'DELETE FROM reflections WHERE id = ?';
    db.run(sql, [id], callback);
  }

  // Get reflections by verse
  static getByVerseId(verseId, userId, callback) {
    const sql = `
      SELECT r.*, 
             v.verse_number, 
             c.chapter_number,
             c.title_english as chapter_title
      FROM reflections r
      JOIN gita.verses v ON r.verse_id = v.id
      JOIN gita.chapters c ON v.chapter_id = c.id
      WHERE r.verse_id = ? AND r.user_id = ?
      ORDER BY r.created_at DESC
    `;
    db.all(sql, [verseId, userId], callback);
  }

  // Get reflections by chapter
  static getByChapterId(chapterId, userId, callback) {
    const sql = `
      SELECT r.*, 
             v.verse_number, 
             c.chapter_number,
             c.title_english as chapter_title
      FROM reflections r
      LEFT JOIN gita.verses v ON r.verse_id = v.id
      JOIN gita.chapters c ON r.chapter_id = c.id OR v.chapter_id = c.id
      WHERE (r.chapter_id = ? OR v.chapter_id = ?) AND r.user_id = ?
      ORDER BY r.created_at DESC
    `;
    db.all(sql, [chapterId, chapterId, userId], callback);
  }
}

module.exports = Reflection;
