const db = require('../config/database');

class Item {
  // Get all items
  static getAll(callback) {
    const sql = `
      SELECT items.*, users.username 
      FROM items 
      LEFT JOIN users ON items.user_id = users.id
      ORDER BY items.created_at DESC
    `;
    db.all(sql, [], callback);
  }

  // Get item by ID
  static getById(id, callback) {
    const sql = `
      SELECT items.*, users.username 
      FROM items 
      LEFT JOIN users ON items.user_id = users.id
      WHERE items.id = ?
    `;
    db.get(sql, [id], callback);
  }

  // Get items by user ID
  static getByUserId(userId, callback) {
    const sql = 'SELECT * FROM items WHERE user_id = ? ORDER BY created_at DESC';
    db.all(sql, [userId], callback);
  }

  // Create new item
  static create(itemData, callback) {
    const sql = 'INSERT INTO items (title, description, user_id) VALUES (?, ?, ?)';
    db.run(sql, [itemData.title, itemData.description, itemData.user_id], function(err) {
      callback(err, { id: this.lastID });
    });
  }

  // Update item
  static update(id, itemData, callback) {
    const sql = 'UPDATE items SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    db.run(sql, [itemData.title, itemData.description, id], callback);
  }

  // Delete item
  static delete(id, callback) {
    const sql = 'DELETE FROM items WHERE id = ?';
    db.run(sql, [id], callback);
  }
}

module.exports = Item;
