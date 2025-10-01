const db = require('../config/database');

class User {
  // Get all users
  static getAll(callback) {
    const sql = 'SELECT id, username, email, created_at FROM users';
    db.all(sql, [], callback);
  }

  // Get user by ID
  static getById(id, callback) {
    const sql = 'SELECT id, username, email, created_at FROM users WHERE id = ?';
    db.get(sql, [id], callback);
  }

  // Get user by email
  static getByEmail(email, callback) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.get(sql, [email], callback);
  }

  // Create new user
  static create(userData, callback) {
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.run(sql, [userData.username, userData.email, userData.password], function(err) {
      callback(err, { id: this.lastID });
    });
  }

  // Update user
  static update(id, userData, callback) {
    const sql = 'UPDATE users SET username = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    db.run(sql, [userData.username, userData.email, id], callback);
  }

  // Delete user
  static delete(id, callback) {
    const sql = 'DELETE FROM users WHERE id = ?';
    db.run(sql, [id], callback);
  }
}

module.exports = User;
